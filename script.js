// Mind Map Creator Script

// Canvas setup and variables
const canvas = document.getElementById('mind-map-canvas');
const ctx = canvas.getContext('2d');
let nodes = [];
let connections = [];
let selectedNode = null;
let draggedNode = null;
let isDragging = false;
let startX, startY;
let offsetX = 0;
let offsetY = 0;
let scale = 1;

// DOM Elements
const addNodeBtn = document.getElementById('add-node-btn');
const addChildBtn = document.getElementById('add-child-btn');
const deleteNodeBtn = document.getElementById('delete-node-btn');
const clearBtn = document.getElementById('clear-btn');
const saveBtn = document.getElementById('save-btn');
const loadBtn = document.getElementById('load-btn');
const nodeEditor = document.getElementById('node-editor');
const nodeText = document.getElementById('node-text');
const nodeColor = document.getElementById('node-color');
const applyChangesBtn = document.getElementById('apply-changes-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const printBtn = document.getElementById('print-btn');

// Node class
class Node {
    constructor(id, x, y, text, color, parentId = null) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.text = text;
        this.color = color;
        this.width = 150;
        this.height = 50;
        this.parentId = parentId;
        this.children = [];
    }

    // Check if point is inside node
    containsPoint(x, y) {
        return (
            x >= this.x - this.width / 2 &&
            x <= this.x + this.width / 2 &&
            y >= this.y - this.height / 2 &&
            y <= this.y + this.height / 2
        );
    }

    // Draw node
    draw(ctx, isSelected = false) {
        ctx.save();
        
        // Draw node body
        ctx.fillStyle = this.color;
        ctx.strokeStyle = isSelected ? '#3498db' : '#2c3e50';
        ctx.lineWidth = isSelected ? 3 : 2;
        
        // Create rounded rectangle
        const radius = 20;
        ctx.beginPath();
        ctx.moveTo(this.x - this.width / 2 + radius, this.y - this.height / 2);
        ctx.lineTo(this.x + this.width / 2 - radius, this.y - this.height / 2);
        ctx.quadraticCurveTo(this.x + this.width / 2, this.y - this.height / 2, this.x + this.width / 2, this.y - this.height / 2 + radius);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height / 2 - radius);
        ctx.quadraticCurveTo(this.x + this.width / 2, this.y + this.height / 2, this.x + this.width / 2 - radius, this.y + this.height / 2);
        ctx.lineTo(this.x - this.width / 2 + radius, this.y + this.height / 2);
        ctx.quadraticCurveTo(this.x - this.width / 2, this.y + this.height / 2, this.x - this.width / 2, this.y + this.height / 2 - radius);
        ctx.lineTo(this.x - this.width / 2, this.y - this.height / 2 + radius);
        ctx.quadraticCurveTo(this.x - this.width / 2, this.y - this.height / 2, this.x - this.width / 2 + radius, this.y - this.height / 2);
        ctx.closePath();
        
        ctx.fill();
        ctx.stroke();
        
        // Draw text
        ctx.fillStyle = getContrastColor(this.color);
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Handle text wrapping
        const words = this.text.split(' ');
        let line = '';
        let lines = [];
        const maxWidth = this.width - 20;
        
        for (let word of words) {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && line !== '') {
                lines.push(line);
                line = word + ' ';
            } else {
                line = testLine;
            }
        }
        
        lines.push(line);
        
        // Draw each line
        let y = this.y - ((lines.length - 1) * 18) / 2;
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], this.x, y);
            y += 18;
        }
        
        ctx.restore();
    }
}

// Initialize canvas size
function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    draw();
}

// Get contrast color for text (black or white based on background)
function getContrastColor(hexColor) {
    // Remove # if present
    hexColor = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    
    // Calculate luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for light colors, white for dark colors
    return luminance > 0.5 ? '#000000' : '#ffffff';
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply transform for panning
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    
    // Draw connections
    drawConnections();
    
    // Draw nodes
    nodes.forEach(node => {
        node.draw(ctx, selectedNode === node);
    });
    
    ctx.restore();
}

// Draw connections between nodes
function drawConnections() {
    ctx.save();
    
    connections.forEach(conn => {
        const parent = nodes.find(node => node.id === conn.parentId);
        const child = nodes.find(node => node.id === conn.childId);
        
        if (parent && child) {
            // Start and end points
            const startX = parent.x;
            const startY = parent.y;
            const endX = child.x;
            const endY = child.y;
            
            // Draw bezier curve connection
            ctx.beginPath();
            ctx.moveTo(startX, startY + parent.height / 2);
            
            // Control points for the curve
            const cpX1 = startX;
            const cpY1 = startY + parent.height / 2 + 50;
            const cpX2 = endX;
            const cpY2 = endY - child.height / 2 - 50;
            
            ctx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, endX, endY - child.height / 2);
            
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw arrow at the end
            const angle = Math.atan2(endY - child.height / 2 - cpY2, endX - cpX2);
            ctx.beginPath();
            ctx.moveTo(endX, endY - child.height / 2);
            ctx.lineTo(
                endX - 10 * Math.cos(angle - Math.PI / 6),
                endY - child.height / 2 - 10 * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
                endX - 10 * Math.cos(angle + Math.PI / 6),
                endY - child.height / 2 - 10 * Math.sin(angle + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fillStyle = '#666';
            ctx.fill();
        }
    });
    
    ctx.restore();
}

// Create a new node
function createNode(x, y, text = 'New Node', color = '#4CAF50', parentId = null) {
    const id = Date.now().toString();
    const node = new Node(id, x, y, text, color, parentId);
    nodes.push(node);
    
    // If it has a parent, create connection
    if (parentId) {
        const parent = nodes.find(node => node.id === parentId);
        if (parent) {
            connections.push({ parentId, childId: id });
            parent.children.push(id);
        }
    }
    
    return node;
}

// Delete a node and its children
function deleteNode(node) {
    if (!node) return;
    
    // Recursively delete children
    [...node.children].forEach(childId => {
        const child = nodes.find(n => n.id === childId);
        if (child) {
            deleteNode(child);
        }
    });
    
    // Remove connections
    connections = connections.filter(conn => 
        conn.parentId !== node.id && conn.childId !== node.id
    );
    
    // Remove from parent's children list
    if (node.parentId) {
        const parent = nodes.find(n => n.id === node.parentId);
        if (parent) {
            parent.children = parent.children.filter(id => id !== node.id);
        }
    }
    
    // Remove node
    nodes = nodes.filter(n => n.id !== node.id);
    
    // Reset selection if this was the selected node
    if (selectedNode === node) {
        selectedNode = null;
        updateUIState();
    }
    
    draw();
}

// Find node at position
function findNodeAt(x, y) {
    // Apply inverse transform to get canvas coordinates
    const canvasX = (x - offsetX) / scale;
    const canvasY = (y - offsetY) / scale;
    
    // Check in reverse order (top-most node first)
    for (let i = nodes.length - 1; i >= 0; i--) {
        if (nodes[i].containsPoint(canvasX, canvasY)) {
            return nodes[i];
        }
    }
    return null;
}

// Update UI state based on selection
function updateUIState() {
    addChildBtn.disabled = !selectedNode;
    deleteNodeBtn.disabled = !selectedNode;
    
    // Hide node editor if no node is selected
    if (!selectedNode) {
        nodeEditor.classList.remove('active');
    }
}

// Event Listeners
window.addEventListener('resize', resizeCanvas);

// Mouse event handlers
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const node = findNodeAt(mouseX, mouseY);
    
    if (node) {
        // Select node
        selectedNode = node;
        draggedNode = node;
        isDragging = true;
        startX = mouseX;
        startY = mouseY;
    } else {
        // Start canvas panning
        selectedNode = null;
        isDragging = true;
        startX = mouseX;
        startY = mouseY;
    }
    
    updateUIState();
    draw();
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const dx = mouseX - startX;
    const dy = mouseY - startY;
    
    if (draggedNode) {
        // Move the node
        draggedNode.x += dx / scale;
        draggedNode.y += dy / scale;
    } else {
        // Pan the canvas
        offsetX += dx;
        offsetY += dy;
    }
    
    startX = mouseX;
    startY = mouseY;
    draw();
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
    draggedNode = null;
});

canvas.addEventListener('dblclick', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const node = findNodeAt(mouseX, mouseY);
    
    if (node) {
        // Edit existing node
        selectedNode = node;
        openNodeEditor(node);
    } else {
        // Create new node at click position if no node exists
        const canvasX = (mouseX - offsetX) / scale;
        const canvasY = (mouseY - offsetY) / scale;
        const newNode = createNode(canvasX, canvasY);
        selectedNode = newNode;
        openNodeEditor(newNode);
    }
    
    updateUIState();
    draw();
});

// Mouse wheel for zooming
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Determine zoom direction
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    
    // Calculate new scale
    const newScale = scale * zoomFactor;
    
    // Limit zoom range
    if (newScale > 0.2 && newScale < 5) {
        // Adjust offset to zoom into/out of mouse position
        offsetX = mouseX - (mouseX - offsetX) * zoomFactor;
        offsetY = mouseY - (mouseY - offsetY) * zoomFactor;
        
        scale = newScale;
        draw();
    }
});

// Button click handlers
addNodeBtn.addEventListener('click', () => {
    // Create a new root node at the center of the canvas
    const centerX = canvas.width / 2 / scale - offsetX / scale;
    const centerY = canvas.height / 2 / scale - offsetY / scale;
    const newNode = createNode(centerX, centerY);
    selectedNode = newNode;
    openNodeEditor(newNode);
    updateUIState();
    draw();
});

addChildBtn.addEventListener('click', () => {
    if (!selectedNode) return;
    
    // Create a child node below the selected node
    const childX = selectedNode.x;
    const childY = selectedNode.y + 150;
    const newNode = createNode(childX, childY, 'New Child', nodeColor.value, selectedNode.id);
    selectedNode = newNode;
    openNodeEditor(newNode);
    updateUIState();
    draw();
});

deleteNodeBtn.addEventListener('click', () => {
    if (selectedNode) {
        deleteNode(selectedNode);
    }
});

clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the entire mind map?')) {
        nodes = [];
        connections = [];
        selectedNode = null;
        updateUIState();
        draw();
    }
});

saveBtn.addEventListener('click', () => {
    const data = {
        nodes: nodes,
        connections: connections,
        offsetX: offsetX,
        offsetY: offsetY,
        scale: scale
    };
    
    const jsonString = JSON.stringify(data);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindmap.json';
    a.click();
    
    URL.revokeObjectURL(url);
});

// Print functionality
printBtn.addEventListener('click', () => {
    // Create a print-optimized version of the canvas
    preparePrint();
});

// Prepare mind map for printing
function preparePrint() {
    // Store current state
    const originalScale = scale;
    const originalOffsetX = offsetX;
    const originalOffsetY = offsetY;
    
    // Create a temporary container for printing
    const printContainer = document.createElement('div');
    printContainer.className = 'print-container';
    document.body.appendChild(printContainer);
    
    // Create a new canvas for printing
    const printCanvas = document.createElement('canvas');
    printCanvas.width = canvas.width;
    printCanvas.height = canvas.height;
    printContainer.appendChild(printCanvas);
    
    // Get the canvas context and copy the mind map
    const printCtx = printCanvas.getContext('2d');
    
    // Determine the bounding box of all nodes
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    nodes.forEach(node => {
        minX = Math.min(minX, node.x - node.width/2);
        minY = Math.min(minY, node.y - node.height/2);
        maxX = Math.max(maxX, node.x + node.width/2);
        maxY = Math.max(maxY, node.y + node.height/2);
    });
    
    // Add padding
    const padding = 50;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;
    
    // Calculate dimensions and scale
    const width = maxX - minX;
    const height = maxY - minY;
    
    // Set print canvas size
    printCanvas.width = width;
    printCanvas.height = height;
    
    // Position the mind map in the print canvas
    printCtx.translate(-minX, -minY);
    
    // Draw connections
    connections.forEach(conn => {
        const parent = nodes.find(node => node.id === conn.parentId);
        const child = nodes.find(node => node.id === conn.childId);
        
        if (parent && child) {
            // Start and end points
            const startX = parent.x;
            const startY = parent.y;
            const endX = child.x;
            const endY = child.y;
            
            // Draw bezier curve connection
            printCtx.beginPath();
            printCtx.moveTo(startX, startY + parent.height / 2);
            
            // Control points for the curve
            const cpX1 = startX;
            const cpY1 = startY + parent.height / 2 + 50;
            const cpX2 = endX;
            const cpY2 = endY - child.height / 2 - 50;
            
            printCtx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, endX, endY - child.height / 2);
            
            printCtx.strokeStyle = '#666';
            printCtx.lineWidth = 2;
            printCtx.stroke();
            
            // Draw arrow at the end
            const angle = Math.atan2(endY - child.height / 2 - cpY2, endX - cpX2);
            printCtx.beginPath();
            printCtx.moveTo(endX, endY - child.height / 2);
            printCtx.lineTo(
                endX - 10 * Math.cos(angle - Math.PI / 6),
                endY - child.height / 2 - 10 * Math.sin(angle - Math.PI / 6)
            );
            printCtx.lineTo(
                endX - 10 * Math.cos(angle + Math.PI / 6),
                endY - child.height / 2 - 10 * Math.sin(angle + Math.PI / 6)
            );
            printCtx.closePath();
            printCtx.fillStyle = '#666';
            printCtx.fill();
        }
    });
    
    // Draw nodes
    nodes.forEach(node => {
        // Draw node body
        printCtx.fillStyle = node.color;
        printCtx.strokeStyle = '#2c3e50';
        printCtx.lineWidth = 2;
        
        // Create rounded rectangle
        const radius = 20;
        printCtx.beginPath();
        printCtx.moveTo(node.x - node.width / 2 + radius, node.y - node.height / 2);
        printCtx.lineTo(node.x + node.width / 2 - radius, node.y - node.height / 2);
        printCtx.quadraticCurveTo(node.x + node.width / 2, node.y - node.height / 2, node.x + node.width / 2, node.y - node.height / 2 + radius);
        printCtx.lineTo(node.x + node.width / 2, node.y + node.height / 2 - radius);
        printCtx.quadraticCurveTo(node.x + node.width / 2, node.y + node.height / 2, node.x + node.width / 2 - radius, node.y + node.height / 2);
        printCtx.lineTo(node.x - node.width / 2 + radius, node.y + node.height / 2);
        printCtx.quadraticCurveTo(node.x - node.width / 2, node.y + node.height / 2, node.x - node.width / 2, node.y + node.height / 2 - radius);
        printCtx.lineTo(node.x - node.width / 2, node.y - node.height / 2 + radius);
        printCtx.quadraticCurveTo(node.x - node.width / 2, node.y - node.height / 2, node.x - node.width / 2 + radius, node.y - node.height / 2);
        printCtx.closePath();
        
        printCtx.fill();
        printCtx.stroke();
        
        // Draw text
        printCtx.fillStyle = getContrastColor(node.color);
        printCtx.font = '14px Arial';
        printCtx.textAlign = 'center';
        printCtx.textBaseline = 'middle';
        
        // Handle text wrapping
        const words = node.text.split(' ');
        let line = '';
        let lines = [];
        const maxWidth = node.width - 20;
        
        for (let word of words) {
            const testLine = line + word + ' ';
            const metrics = printCtx.measureText(testLine);
            if (metrics.width > maxWidth && line !== '') {
                lines.push(line);
                line = word + ' ';
            } else {
                line = testLine;
            }
        }
        
        lines.push(line);
        
        // Draw each line
        let y = node.y - ((lines.length - 1) * 18) / 2;
        for (let i = 0; i < lines.length; i++) {
            printCtx.fillText(lines[i], node.x, y);
            y += 18;
        }
    });
    
    // Add title
    const title = document.createElement('h2');
    title.textContent = 'Mind Map';
    title.style.textAlign = 'center';
    title.style.margin = '20px 0';
    printContainer.insertBefore(title, printCanvas);
    
    // Add print-only CSS
    const style = document.createElement('style');
    style.textContent = `
        @media print {
            body * {
                visibility: hidden;
            }
            .print-container, .print-container * {
                visibility: visible;
            }
            .print-container {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Trigger print dialog
    setTimeout(() => {
        window.print();
        
        // Clean up after printing
        setTimeout(() => {
            document.body.removeChild(printContainer);
            document.head.removeChild(style);
            
            // Restore original state
            scale = originalScale;
            offsetX = originalOffsetX;
            offsetY = originalOffsetY;
            draw();
        }, 500);
    }, 500);
}

// Helper function to recreate Node instance from plain object
function recreateNode(nodeData) {
    // Create a new Node instance with the basic properties
    const node = new Node(
        nodeData.id,
        nodeData.x,
        nodeData.y,
        nodeData.text,
        nodeData.color,
        nodeData.parentId
    );
    
    // Copy any additional properties that might exist
    node.width = nodeData.width || 150;
    node.height = nodeData.height || 50;
    node.children = [...(nodeData.children || [])];
    
    return node;
}

loadBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                
                // Recreate nodes as proper Node instances
                nodes = data.nodes.map(nodeData => recreateNode(nodeData));
                
                // Load connections
                connections = data.connections;
                
                // Load view settings
                offsetX = data.offsetX || 0;
                offsetY = data.offsetY || 0;
                scale = data.scale || 1;
                
                selectedNode = null;
                updateUIState();
                draw();
            } catch (error) {
                alert('Error loading file: ' + error.message);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
});

// Node editor functions
function openNodeEditor(node) {
    nodeText.value = node.text;
    nodeColor.value = node.color;
    nodeEditor.classList.add('active');
}

applyChangesBtn.addEventListener('click', () => {
    if (selectedNode) {
        selectedNode.text = nodeText.value || 'Untitled';
        selectedNode.color = nodeColor.value;
        nodeEditor.classList.remove('active');
        draw();
    }
});

cancelEditBtn.addEventListener('click', () => {
    nodeEditor.classList.remove('active');
});

// Initialize
resizeCanvas();
updateUIState();