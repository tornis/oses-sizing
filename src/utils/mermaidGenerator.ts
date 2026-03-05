import { WizardState, TierType } from "@/context/WizardContext";
import { calculateClusterSizing } from "./calculations";

export function generateMermaidDiagram(state: WizardState): string {
    const sizing = calculateClusterSizing(state);
    
    // Ordem fixa das tiers
    const tierOrder: TierType[] = ['hot', 'warm', 'cold', 'frozen'];
    const orderedTiers = tierOrder.filter(tier => state.global.selectedTiers.includes(tier));
    
    let mermaidCode = `graph LR\n`;
    
    // Master Nodes
    if (state.architecture.masterNodes > 0) {
        mermaidCode += `    subgraph master["🔧 Master Nodes"]\n`;
        mermaidCode += `        direction TB\n`;
        for (let i = 1; i <= state.architecture.masterNodes; i++) {
            mermaidCode += `        M${i}["Master ${i}<br/>${state.architecture.masterRamGB}GB RAM<br/>${state.architecture.masterDiskGB}GB Disk"]\n`;
        }
        mermaidCode += `    end\n\n`;
    }
    
    // ML Nodes
    if (state.architecture.mlNodes > 0) {
        mermaidCode += `    subgraph ml["🤖 ML Nodes"]\n`;
        mermaidCode += `        direction TB\n`;
        for (let i = 1; i <= state.architecture.mlNodes; i++) {
            mermaidCode += `        ML${i}["ML ${i}<br/>${state.architecture.mlRamGB}GB RAM<br/>${state.architecture.mlDiskGB}GB Disk"]\n`;
        }
        mermaidCode += `    end\n\n`;
    }
    
    // Coordinator Nodes
    if (state.architecture.coordNodes > 0) {
        mermaidCode += `    subgraph coord["⚡ Coordinator Nodes"]\n`;
        mermaidCode += `        direction TB\n`;
        for (let i = 1; i <= state.architecture.coordNodes; i++) {
            mermaidCode += `        C${i}["Coordinator ${i}<br/>${state.architecture.coordRamGB}GB RAM<br/>${state.architecture.coordDiskGB}GB Disk"]\n`;
        }
        mermaidCode += `    end\n\n`;
    }
    
    // Data Tiers - Ordenadas
    orderedTiers.forEach((tier: TierType) => {
        const tierSizing = sizing.tiers.find(t => t.tierName === tier);
        if (tierSizing && tierSizing.totalNodes > 0) {
            const tierName = tier.charAt(0).toUpperCase() + tier.slice(1);
            const tierIcon = tier === 'hot' ? '🔥' : tier === 'warm' ? '🌡️' : tier === 'cold' ? '❄️' : '🧊';
            
            mermaidCode += `    subgraph ${tier}["${tierIcon} ${tierName} Tier"]\n`;
            mermaidCode += `        direction TB\n`;
            
            for (let i = 1; i <= tierSizing.totalNodes; i++) {
                const ramPerNode = (tierSizing.totalMemoryGB / tierSizing.totalNodes).toFixed(1);
                const diskPerNode = (tierSizing.totalStorageGB / tierSizing.totalNodes).toFixed(1);
                const shardsPerNode = Math.ceil(tierSizing.totalShards / tierSizing.totalNodes);
                mermaidCode += `        ${tier.toUpperCase()}${i}["Node ${i}<br/>${ramPerNode}GB RAM<br/>${diskPerNode}GB Disk<br/>${shardsPerNode} Shards"]\n`;
            }
            
            mermaidCode += `    end\n\n`;
        }
    });
    
    // Styling - Clean and elegant
    mermaidCode += `    classDef masterStyle fill:#1B2A4E,stroke:#F9A825,stroke-width:3px,color:#fff,rx:10,ry:10\n`;
    mermaidCode += `    classDef mlStyle fill:#6366f1,stroke:#F9A825,stroke-width:3px,color:#fff,rx:10,ry:10\n`;
    mermaidCode += `    classDef coordStyle fill:#8b5cf6,stroke:#F9A825,stroke-width:3px,color:#fff,rx:10,ry:10\n`;
    mermaidCode += `    classDef hotStyle fill:#dc2626,stroke:#F9A825,stroke-width:3px,color:#fff,rx:10,ry:10\n`;
    mermaidCode += `    classDef warmStyle fill:#ea580c,stroke:#F9A825,stroke-width:3px,color:#fff,rx:10,ry:10\n`;
    mermaidCode += `    classDef coldStyle fill:#2563eb,stroke:#F9A825,stroke-width:3px,color:#fff,rx:10,ry:10\n`;
    mermaidCode += `    classDef frozenStyle fill:#0891b2,stroke:#F9A825,stroke-width:3px,color:#fff,rx:10,ry:10\n`;
    
    // Apply styles
    if (state.architecture.masterNodes > 0) {
        for (let i = 1; i <= state.architecture.masterNodes; i++) {
            mermaidCode += `    class M${i} masterStyle\n`;
        }
    }
    
    if (state.architecture.mlNodes > 0) {
        for (let i = 1; i <= state.architecture.mlNodes; i++) {
            mermaidCode += `    class ML${i} mlStyle\n`;
        }
    }
    
    if (state.architecture.coordNodes > 0) {
        for (let i = 1; i <= state.architecture.coordNodes; i++) {
            mermaidCode += `    class C${i} coordStyle\n`;
        }
    }
    
    orderedTiers.forEach((tier: TierType) => {
        const tierSizing = sizing.tiers.find(t => t.tierName === tier);
        if (tierSizing && tierSizing.totalNodes > 0) {
            for (let i = 1; i <= tierSizing.totalNodes; i++) {
                mermaidCode += `    class ${tier.toUpperCase()}${i} ${tier}Style\n`;
            }
        }
    });
    
    return mermaidCode;
}
