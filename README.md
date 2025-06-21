# Mind Map Creator 🧠

![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Platform](https://img.shields.io/badge/Platform-Web-orange.svg)

An interactive, web-based mind mapping tool for organizing thoughts, brainstorming, and visual planning. Create dynamic mind maps with drag-and-drop functionality, customizable colors, and persistent storage.

## 🚀 Live Demo

**Try it now**: [https://joefabre.github.io/mindmap/](https://joefabre.github.io/mindmap/)

## ✨ Features

### 🎨 **Interactive Design**
- **Drag & Drop**: Repositiom nodes anywhere on the canvas
- **Visual Connections**: Automatic line drawing between parent and child nodes
- **Custom Colors**: Personalize each node with color selection
- **Responsive Canvas**: Adapts to different screen sizes

### 🔧 **Node Management**
- **Add Root Nodes**: Create new mind map starting points
- **Child Nodes**: Build hierarchical structures
- **Edit Content**: Double-click any node to modify text and appearance
- **Delete Nodes**: Remove nodes and all their children
- **Clear All**: Start fresh with a clean canvas

### 💾 **Data Persistence**
- **Auto-Save**: Your mind maps are automatically saved locally
- **Import/Export**: Save mind maps as JSON files
- **Load Previous Work**: Resume working on saved mind maps
- **Browser Storage**: Uses localStorage for seamless persistence

### 🖨️ **Professional Output**
- **Print Ready**: Generate clean printable versions
- **High Quality**: Vector-based rendering for crisp output
- **Professional Layout**: Optimized for presentations and documentation

## 🛠️ Getting Started

### **Option 1: Online Usage (Recommended)**
Simply visit [https://joefabre.github.io/mindmap/](https://joefabre.github.io/mindmap/) in your web browser - no installation required!

### **Option 2: Local Installation**
1. **Clone the repository**:
   ```bash
   git clone https://github.com/joefabre/mindmap.git
   cd mindmap
   ```

2. **Open in browser**:
   ```bash
   # Open index.html directly, or serve with a local server:
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

## 📖 How to Use

### **Creating Your First Mind Map**

1. **Start with a Root Node**
   - Click "Add Root Node" to create your central idea
   - Enter your main topic or theme

2. **Build Your Structure**
   - Select a node and click "Add Child Node" to expand ideas
   - Create branches for related concepts and subtopics

3. **Customize Appearance**
   - Double-click any node to edit text and change colors
   - Use different colors to categorize or prioritize ideas

4. **Organize and Refine**
   - Drag nodes to optimal positions
   - Delete unnecessary branches
   - Add more detail with additional child nodes

### **Keyboard Shortcuts**
- **Double-click**: Edit node content and color
- **Click + "Add Child"**: Create child from selected node
- **Click + "Delete"**: Remove selected node and children

### **Saving and Loading**
- **Auto-Save**: Work is automatically saved as you go
- **Manual Save**: Click "Save" to download as JSON file
- **Load**: Click "Load" to import previously saved mind maps
- **Print**: Generate a clean, printable version

## 🎯 Use Cases

### **Brainstorming Sessions**
- Capture ideas quickly and organize them visually
- Build on concepts with hierarchical structures
- Color-code ideas by priority or category

### **Project Planning**
- Break down complex projects into manageable components
- Visualize dependencies and relationships
- Track progress with different colors

### **Learning and Study**
- Create study guides and knowledge maps
- Organize lecture notes and textbook content
- Prepare for presentations and exams

### **Creative Writing**
- Plot story structures and character development
- Organize research and world-building elements
- Plan article outlines and content flow

## 🔧 Technical Details

### **Browser Compatibility**
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+
- Mobile browsers (responsive design)

### **Technology Stack**
- **Frontend**: HTML5 Canvas, CSS3, JavaScript ES6+
- **Styling**: Modern CSS with Flexbox and Grid
- **Icons**: Font Awesome 6.0
- **Storage**: HTML5 localStorage
- **Graphics**: Canvas 2D API for vector rendering

### **Performance Features**
- Efficient canvas rendering for smooth interactions
- Optimized event handling for responsive dragging
- Memory-conscious data structures
- Lightweight codebase (~25KB total)

## 📁 Project Structure

```
mindmap/
├── index.html          # Main application interface
├── styles.css          # Modern, responsive styling
├── script.js           # Core mind mapping functionality
├── mindmap.json        # Sample/auto-saved mind map data
└── README.md           # This documentation
```

## 🌟 Key Features in Detail

### **Intelligent Node Positioning**
- Automatic layout suggestions
- Collision detection and spacing
- Smooth drag animations
- Smart connection routing

### **Advanced Canvas Controls**
- Zoom and pan capabilities
- Grid snap functionality  
- Multiple selection support
- Undo/redo system

### **Export Options**
- JSON format for data portability
- Print-optimized layouts
- High-resolution output
- Cross-platform compatibility

## 🚀 Future Enhancements

- **Collaboration**: Real-time multi-user editing
- **Templates**: Pre-built mind map templates
- **Cloud Sync**: Cross-device synchronization
- **Advanced Export**: PDF, PNG, and SVG formats
- **Mobile App**: Native mobile applications

## 🤝 Contributing

Interested in contributing? Great! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by traditional mind mapping techniques
- Font Awesome for beautiful icons
- The open-source community for inspiration

---

**Created with ❤️ for visual thinkers and organized minds**

*Start mapping your ideas today at [https://joefabre.github.io/mindmap/](https://joefabre.github.io/mindmap/)*
