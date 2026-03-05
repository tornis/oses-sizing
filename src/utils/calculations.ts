import { TierType, WizardState, TierData } from "../context/WizardContext";

export const OVERHEAD_FACTOR = 0.25; // 25% overhead for OS, metadata, watermark

export interface TierSizingResult {
    tierName: TierType;
    totalStorageGB: number;
    totalMemoryGB: number;
    totalNodes: number;
    totalShards: number;
}

export interface ClusterSizingResult {
    tiers: TierSizingResult[];
    master: { nodes: number; storageGB: number; memoryGB: number };
    ml: { nodes: number; storageGB: number; memoryGB: number };
    coord: { nodes: number; storageGB: number; memoryGB: number };
    totals: {
        storageGB: number;
        storageTB: number;
        memoryGB: number;
        nodes: number;
        shards: number;
    };
}

/**
 * Calculates sizing for a single tier based on spreadsheet formulas.
 */
export function calculateTierSizing(
    tierName: TierType,
    tierData: TierData,
    globalState: WizardState["global"]
): TierSizingResult {
    const growthFactor = 1 + globalState.growthPercentage / 100;

    // 1. Armazenamento (GB) = Volumetria_Dia * Retenção_Dias * (Réplicas + 1) * (1 + 0.25) * (1 + Crescimento_Percentual)
    const baseStorage =
        tierData.volumePerDayGB *
        tierData.retentionDays *
        (tierData.replicas + 1);
    const totalStorageGB = baseStorage * (1 + OVERHEAD_FACTOR) * growthFactor;

    // 2. Memória Necessária (GB) = Armazenamento (GB) / Ratio_da_Camada
    const ratio = globalState.tierRatios[tierName];
    // Guard against division by zero though our constants are safe
    let totalMemoryGB = totalStorageGB / ratio;

    // 3. Quantidade de Nodes = Math.ceil( Memória Necessária / Memória_Por_Node_Disponivel )
    let totalNodes = Math.ceil(totalMemoryGB / globalState.maxMemoryPerNode);
    
    // Regra de boas práticas: Hot tier deve ter no mínimo 3 nodes para alta disponibilidade
    if (tierName === "hot" && totalNodes < 3) {
        totalNodes = 3;
    }
    
    // Se a memória calculada for <= 0, usar 1GB por instância
    if (totalMemoryGB <= 0) {
        totalMemoryGB = totalNodes * 1; // 1GB por node
    }

    // 4. Quantidade de Shards = Armazenamento (GB) / Tamanho_Máximo_do_Shard
    const totalShards = Math.ceil(totalStorageGB / globalState.maxShardSizeGB);

    return {
        tierName,
        totalStorageGB: totalStorageGB,
        totalMemoryGB: totalMemoryGB,
        totalNodes: totalNodes,
        totalShards: totalShards,
    };
}

/**
 * Calculates the total cluster sizing.
 */
export function calculateClusterSizing(state: WizardState): ClusterSizingResult {
    const { global, tiers, architecture } = state;
    let totalStorageGB = 0;
    let totalMemoryGB = 0;
    let totalNodes = 0;

    const tierResults: TierSizingResult[] = [];

    // Data Tiers Calculation
    global.selectedTiers.forEach((tier) => {
        const result = calculateTierSizing(
            tier,
            tiers[tier],
            global // passing the global settings instead of properties
        );

        if (result.totalNodes > 0) {
            tierResults.push(result);
            totalStorageGB += result.totalStorageGB;
            totalMemoryGB += result.totalMemoryGB;
            totalNodes += result.totalNodes;
        }
    });

    // Architecture Nodes (Masters, ML, Coord) Calculation
    const masterStorage = architecture.masterNodes * architecture.masterDiskGB;
    const masterMemory = architecture.masterNodes * architecture.masterRamGB;

    const mlStorage = architecture.mlNodes * architecture.mlDiskGB;
    const mlMemory = architecture.mlNodes * architecture.mlRamGB;

    const coordStorage = architecture.coordNodes * architecture.coordDiskGB;
    const coordMemory = architecture.coordNodes * architecture.coordRamGB;

    totalStorageGB += masterStorage + mlStorage + coordStorage;
    totalMemoryGB += masterMemory + mlMemory + coordMemory;
    totalNodes += architecture.masterNodes + architecture.mlNodes + architecture.coordNodes;

    // Calculate total shards across all selected tiers
    const totalShards = tierResults.reduce((acc, tier) => acc + tier.totalShards, 0);

    return {
        tiers: tierResults,
        master: {
            nodes: architecture.masterNodes,
            storageGB: masterStorage,
            memoryGB: masterMemory,
        },
        ml: { nodes: architecture.mlNodes, storageGB: mlStorage, memoryGB: mlMemory },
        coord: {
            nodes: architecture.coordNodes,
            storageGB: coordStorage,
            memoryGB: coordMemory,
        },
        totals: {
            storageGB: totalStorageGB,
            storageTB: parseFloat((totalStorageGB / 1024).toFixed(2)),
            memoryGB: Math.round(totalMemoryGB),
            nodes: totalNodes,
            shards: totalShards,
        },
    };
}
