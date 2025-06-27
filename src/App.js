import React, { useState, useRef, useCallback } from 'react';
import { Plus, Code, Download, Trash2, Edit3, Save, FolderOpen, Copy, FileText } from 'lucide-react';
import './App.css';

const GameArchitectureDesigner = () => {
  // Система управления архитектурами
  const [architectures, setArchitectures] = useState([
    {
      id: 'default',
      name: 'Новая архитектура',
      classes: [],
      connections: [],
      categories: ['Gameplay', 'System', 'UI', 'Data', 'Network'],
      camera: { zoom: 1, offsetX: 0, offsetY: 0 },
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }
  ]);
  const [currentArchitectureId, setCurrentArchitectureId] = useState('default');
  const [showArchitectureManager, setShowArchitectureManager] = useState(false);
  const [newArchitectureName, setNewArchitectureName] = useState('');

  // Текущее состояние
  const [selectedClass, setSelectedClass] = useState(null);
  const [draggedClass, setDraggedClass] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [newClassForm, setNewClassForm] = useState({ name: '', type: 'Gameplay' });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);

  // Получаем текущую архитектуру
  const currentArchitecture = architectures.find(arch => arch.id === currentArchitectureId) || architectures[0];
  const classes = currentArchitecture.classes;
  const connections = currentArchitecture.connections;
  const classCategories = currentArchitecture.categories;
  const camera = currentArchitecture.camera;

  // Локальное состояние камеры для плавности панорамирования
  const [localCamera, setLocalCamera] = useState(camera);
  
  // Синхронизируем локальную камеру с архитектурой при переключении
  React.useEffect(() => {
    setLocalCamera(camera);
  }, [currentArchitectureId, camera.zoom, camera.offsetX, camera.offsetY]);

  const classTypeColors = {
    Gameplay: 'bg-blue-100 border-blue-400',
    System: 'bg-green-100 border-green-400',
    UI: 'bg-purple-100 border-purple-400',
    Data: 'bg-yellow-100 border-yellow-400',
    Network: 'bg-red-100 border-red-400',
    default: 'bg-gray-100 border-gray-400'
  };

  const getDynamicClassColor = (type) => {
    if (classTypeColors[type]) return classTypeColors[type];
    
    let hash = 0;
    for (let i = 0; i < type.length; i++) {
      hash = type.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      'bg-pink-100 border-pink-400',
      'bg-indigo-100 border-indigo-400',
      'bg-teal-100 border-teal-400',
      'bg-orange-100 border-orange-400',
      'bg-cyan-100 border-cyan-400',
      'bg-lime-100 border-lime-400'
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Функции для работы с архитектурами
  const updateCurrentArchitecture = (updates) => {
    setArchitectures(prev => prev.map(arch => 
      arch.id === currentArchitectureId 
        ? { ...arch, ...updates, lastModified: new Date().toISOString() }
        : arch
    ));
  };

  const createNewArchitecture = () => {
    if (!newArchitectureName.trim()) return;
    
    const newArch = {
      id: generateId(),
      name: newArchitectureName,
      classes: [],
      connections: [],
      categories: ['Gameplay', 'System', 'UI', 'Data', 'Network'],
      camera: { zoom: 1, offsetX: 0, offsetY: 0 },
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    setArchitectures(prev => [...prev, newArch]);
    setCurrentArchitectureId(newArch.id);
    setNewArchitectureName('');
    setShowArchitectureManager(false);
  };

  const deleteArchitecture = (archId) => {
    if (architectures.length <= 1) return;
    
    setArchitectures(prev => prev.filter(arch => arch.id !== archId));
    
    if (currentArchitectureId === archId) {
      const remainingArchs = architectures.filter(arch => arch.id !== archId);
      setCurrentArchitectureId(remainingArchs[0].id);
    }
  };

  const duplicateArchitecture = (archId) => {
    const archToDuplicate = architectures.find(arch => arch.id === archId);
    if (!archToDuplicate) return;
    
    const duplicatedArch = {
      ...archToDuplicate,
      id: generateId(),
      name: `${archToDuplicate.name} (копия)`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    setArchitectures(prev => [...prev, duplicatedArch]);
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const formattedName = newCategoryName.charAt(0).toUpperCase() + newCategoryName.slice(1).toLowerCase();
    
    if (classCategories.includes(formattedName)) return;
    
    const updatedCategories = [...classCategories, formattedName];
    updateCurrentArchitecture({ categories: updatedCategories });
    setNewCategoryName('');
  };

  const removeCategory = (category) => {
    if (classCategories.length <= 1) return;
    
    const updatedCategories = classCategories.filter(c => c !== category);
    const updatedClasses = classes.map(c => 
      c.type === category ? { ...c, type: updatedCategories[0] } : c
    );
    
    updateCurrentArchitecture({ 
      categories: updatedCategories,
      classes: updatedClasses
    });
  };

  const addCustomClass = () => {
    if (!newClassForm.name.trim()) return;
    
    const newClass = {
      id: generateId(),
      name: newClassForm.name,
      type: newClassForm.type,
      position: { 
        x: (100 - localCamera.offsetX) / localCamera.zoom, 
        y: (100 - localCamera.offsetY) / localCamera.zoom 
      },
      properties: [],
      methods: []
    };
    
    const updatedClasses = [...classes, newClass];
    updateCurrentArchitecture({ classes: updatedClasses });
    setNewClassForm({ name: '', type: classCategories[0] });
  };

  const deleteClass = (classId) => {
    const updatedClasses = classes.filter(c => c.id !== classId);
    const updatedConnections = connections.filter(c => c.from !== classId && c.to !== classId);
    
    updateCurrentArchitecture({ 
      classes: updatedClasses,
      connections: updatedConnections
    });
    
    if (selectedClass?.id === classId) setSelectedClass(null);
  };

  const handleMouseDown = (e, classObj) => {
    e.stopPropagation();
    if (e.target.closest('.no-drag')) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggedClass(classObj);
    setSelectedClass(classObj);
  };

  const handleCanvasMouseDown = (e) => {
    if (!e.target.closest('.class-block') && e.button === 0) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setSelectedClass(null);
    }
  };

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(3, localCamera.zoom * delta));
    
    const zoomPointX = (mouseX - localCamera.offsetX) / localCamera.zoom;
    const zoomPointY = (mouseY - localCamera.offsetY) / localCamera.zoom;
    
    const newOffsetX = mouseX - zoomPointX * newZoom;
    const newOffsetY = mouseY - zoomPointY * newZoom;
    
    const newCamera = {
      zoom: newZoom,
      offsetX: newOffsetX,
      offsetY: newOffsetY
    };
    
    setLocalCamera(newCamera);
    updateCurrentArchitecture({ camera: newCamera });
  }, [localCamera, currentArchitectureId]);

  React.useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isPanning) {
        const deltaX = e.clientX - panStart.x;
        const deltaY = e.clientY - panStart.y;
        
        const newCamera = {
          ...localCamera,
          offsetX: localCamera.offsetX + deltaX,
          offsetY: localCamera.offsetY + deltaY
        };
        
        setLocalCamera(newCamera);
        setPanStart({ x: e.clientX, y: e.clientY });
      } else if (draggedClass) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const newX = (e.clientX - canvasRect.left - dragOffset.x - localCamera.offsetX) / localCamera.zoom;
        const newY = (e.clientY - canvasRect.top - dragOffset.y - localCamera.offsetY) / localCamera.zoom;
        
        const updatedClasses = classes.map(c => 
          c.id === draggedClass.id 
            ? { ...c, position: { x: Math.max(0, newX), y: Math.max(0, newY) } }
            : c
        );
        updateCurrentArchitecture({ classes: updatedClasses });
      }
    };

    const handleGlobalMouseUp = () => {
      if (isPanning) {
        updateCurrentArchitecture({ camera: localCamera });
      }
      setDraggedClass(null);
      setIsPanning(false);
    };

    if (draggedClass || isPanning) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [draggedClass, isPanning, dragOffset, localCamera, panStart, classes, currentArchitectureId]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      return () => canvas.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  React.useEffect(() => {
    if (classCategories.length > 0 && !newClassForm.type) {
      setNewClassForm(prev => ({ ...prev, type: classCategories[0] }));
    }
  }, [classCategories]);

  const updateClassProperty = (classId, field, value) => {
    const updatedClasses = classes.map(c => 
      c.id === classId ? { ...c, [field]: value } : c
    );
    updateCurrentArchitecture({ classes: updatedClasses });
  };

  const addProperty = (classId) => {
    const updatedClasses = classes.map(c => 
      c.id === classId 
        ? { ...c, properties: [...c.properties, { name: 'newProperty', type: 'int', access: 'private' }] }
        : c
    );
    updateCurrentArchitecture({ classes: updatedClasses });
  };

  const addMethod = (classId) => {
    const updatedClasses = classes.map(c => 
      c.id === classId 
        ? { ...c, methods: [...c.methods, { name: 'newMethod', params: '', returnType: 'void', access: 'public' }] }
        : c
    );
    updateCurrentArchitecture({ classes: updatedClasses });
  };

  const exportCode = () => {
    let code = `// Generated Game Architecture: ${currentArchitecture.name}\n`;
    code += `// Created: ${new Date(currentArchitecture.createdAt).toLocaleDateString()}\n`;
    code += `// Last Modified: ${new Date(currentArchitecture.lastModified).toLocaleDateString()}\n\n`;
    
    classes.forEach(cls => {
      code += `class ${cls.name} {\n`;
      
      if (cls.properties.length > 0) {
        code += '  // Properties\n';
        cls.properties.forEach(prop => {
          code += `  ${prop.access} ${prop.type} ${prop.name};\n`;
        });
        code += '\n';
      }
      
      if (cls.methods.length > 0) {
        code += '  // Methods\n';
        cls.methods.forEach(method => {
          code += `  ${method.access} ${method.returnType} ${method.name}(${method.params}) {\n    // TODO: Implement\n  }\n\n`;
        });
      }
      
      code += '}\n\n';
    });
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentArchitecture.name.replace(/[^a-zA-Z0-9]/g, '_')}_architecture.cs`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportArchitectureJSON = () => {
    const dataStr = JSON.stringify(currentArchitecture, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentArchitecture.name.replace(/[^a-zA-Z0-9]/g, '_')}_architecture.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Боковая панель */}
      <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        {/* Управление архитектурами */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">Архитектуры</h3>
            <button
              onClick={() => setShowArchitectureManager(!showArchitectureManager)}
              className="text-blue-600 hover:text-blue-800"
            >
              <FolderOpen size={16} />
            </button>
          </div>
          
          <div className="mb-2">
            <select
              value={currentArchitectureId}
              onChange={(e) => setCurrentArchitectureId(e.target.value)}
              className="w-full p-1 border rounded text-sm"
            >
              {architectures.map(arch => (
                <option key={arch.id} value={arch.id}>
                  {arch.name} ({arch.classes.length} классов)
                </option>
              ))}
            </select>
          </div>
          
          {showArchitectureManager && (
            <div className="space-y-2">
              <div className="flex gap-1">
                <input
                  type="text"
                  placeholder="Название архитектуры"
                  value={newArchitectureName}
                  onChange={(e) => setNewArchitectureName(e.target.value)}
                  className="flex-1 p-1 border rounded text-xs"
                  onKeyPress={(e) => e.key === 'Enter' && createNewArchitecture()}
                />
                <button
                  onClick={createNewArchitecture}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                >
                  <Plus size={12} />
                </button>
              </div>
              
              <div className="max-h-32 overflow-y-auto space-y-1">
                {architectures.map(arch => (
                  <div key={arch.id} className="flex items-center justify-between p-1 bg-white rounded border text-xs">
                    <span className="truncate flex-1">{arch.name}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => duplicateArchitecture(arch.id)}
                        className="text-green-600 hover:text-green-800"
                        title="Дублировать"
                      >
                        <Copy size={10} />
                      </button>
                      {architectures.length > 1 && (
                        <button
                          onClick={() => deleteArchitecture(arch.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Удалить"
                        >
                          <Trash2 size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold mb-4">Конструктор архитектуры</h2>
        
        {/* Управление категориями */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Категории классов</h3>
          <div className="space-y-2 mb-3">
            {classCategories.map((category) => (
              <div key={category} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">{category}</span>
                {classCategories.length > 1 && (
                  <button
                    onClick={() => removeCategory(category)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Новая категория"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1 p-2 border rounded text-sm"
              onKeyPress={(e) => e.key === 'Enter' && addCategory()}
            />
            <button
              onClick={addCategory}
              className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Создание класса */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Создать класс</h3>
          <input
            type="text"
            placeholder="Название класса"
            value={newClassForm.name}
            onChange={(e) => setNewClassForm(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 border rounded mb-2"
          />
          <select
            value={newClassForm.type}
            onChange={(e) => setNewClassForm(prev => ({ ...prev, type: e.target.value }))}
            className="w-full p-2 border rounded mb-2"
          >
            {classCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button
            onClick={addCustomClass}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Добавить класс
          </button>
        </div>

        {/* Действия */}
        <div className="space-y-2 mb-4">
          <button
            onClick={exportCode}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center justify-center gap-2"
          >
            <Download size={16} />
            Экспорт кода
          </button>
          <button
            onClick={exportArchitectureJSON}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
          >
            <FileText size={16} />
            Экспорт JSON
          </button>
        </div>

        {/* Управление камерой */}
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2 text-sm">Управление камерой</h3>
          <div className="text-xs text-gray-600 mb-2">
            Зум: {Math.round(localCamera.zoom * 100)}%
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const newCamera = { ...localCamera, zoom: Math.min(3, localCamera.zoom * 1.2) };
                setLocalCamera(newCamera);
                updateCurrentArchitecture({ camera: newCamera });
              }}
              className="flex-1 bg-blue-500 text-white py-1 px-2 rounded text-xs hover:bg-blue-600"
            >
              +
            </button>
            <button
              onClick={() => {
                const newCamera = { zoom: 1, offsetX: 0, offsetY: 0 };
                setLocalCamera(newCamera);
                updateCurrentArchitecture({ camera: newCamera });
              }}
              className="flex-1 bg-gray-500 text-white py-1 px-2 rounded text-xs hover:bg-gray-600"
            >
              Сброс
            </button>
            <button
              onClick={() => {
                const newCamera = { ...localCamera, zoom: Math.max(0.1, localCamera.zoom * 0.8) };
                setLocalCamera(newCamera);
                updateCurrentArchitecture({ camera: newCamera });
              }}
              className="flex-1 bg-blue-500 text-white py-1 px-2 rounded text-xs hover:bg-blue-600"
            >
              -
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Колесо мыши - зум<br/>
            ЛКМ + перетаскивание - панорама
          </div>
        </div>

        {/* Детали выбранного класса */}
        {selectedClass && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold mb-2">Редактирование: {selectedClass.name}</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Название</label>
              <input
                type="text"
                value={selectedClass.name}
                onChange={(e) => updateClassProperty(selectedClass.id, 'name', e.target.value)}
                className="w-full p-2 border rounded text-sm"
              />
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Свойства</label>
                <button
                  onClick={() => addProperty(selectedClass.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Plus size={14} />
                </button>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {selectedClass.properties.map((prop, idx) => (
                  <div key={idx} className="text-xs bg-gray-50 p-1 rounded">
                    {prop.access} {prop.type} {prop.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Методы</label>
                <button
                  onClick={() => addMethod(selectedClass.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Plus size={14} />
                </button>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {selectedClass.methods.map((method, idx) => (
                  <div key={idx} className="text-xs bg-gray-50 p-1 rounded">
                    {method.access} {method.returnType} {method.name}({method.params})
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => deleteClass(selectedClass.id)}
              className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              Удалить класс
            </button>
          </div>
        )}
      </div>

      {/* Рабочая область */}
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={canvasRef}
          className="w-full h-full bg-gray-100 relative overflow-hidden select-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #ccc 1px, transparent 1px)',
            backgroundSize: `${20 * localCamera.zoom}px ${20 * localCamera.zoom}px`,
            backgroundPosition: `${localCamera.offsetX}px ${localCamera.offsetY}px`,
            cursor: isPanning ? 'grabbing' : 'grab'
          }}
          onMouseDown={handleCanvasMouseDown}
        >
          <div
            style={{
              transform: `translate(${localCamera.offsetX}px, ${localCamera.offsetY}px) scale(${localCamera.zoom})`,
              transformOrigin: '0 0',
              position: 'absolute',
              width: '100%',
              height: '100%'
            }}
          >
          {classes.map((classObj) => (
            <div
              key={classObj.id}
              className={`class-block absolute bg-white border-2 rounded-lg shadow-md cursor-move min-w-48 ${getDynamicClassColor(classObj.type)} ${selectedClass?.id === classObj.id ? 'ring-2 ring-blue-500' : ''}`}
              style={{
                left: classObj.position.x,
                top: classObj.position.y,
                userSelect: 'none'
              }}
              onMouseDown={(e) => handleMouseDown(e, classObj)}
            >
              {/* Заголовок класса */}
              <div className="bg-white bg-opacity-80 p-2 border-b">
                <div className="font-bold text-sm">{classObj.name}</div>
                <div className="text-xs text-gray-600">{classObj.type}</div>
              </div>

              {/* Свойства */}
              {classObj.properties.length > 0 && (
                <div className="p-2 border-b bg-white bg-opacity-50">
                  <div className="text-xs font-semibold mb-1">Properties:</div>
                  {classObj.properties.slice(0, 3).map((prop, idx) => (
                    <div key={idx} className="text-xs text-gray-700">
                      {prop.access === 'private' ? '-' : '+'} {prop.name}: {prop.type}
                    </div>
                  ))}
                  {classObj.properties.length > 3 && (
                    <div className="text-xs text-gray-500">...и ещё {classObj.properties.length - 3}</div>
                  )}
                </div>
              )}

              {/* Методы */}
              {classObj.methods.length > 0 && (
                <div className="p-2 bg-white bg-opacity-30">
                  <div className="text-xs font-semibold mb-1">Methods:</div>
                  {classObj.methods.length > 3 && (
                    <div className="text-xs text-gray-500">...и ещё {classObj.methods.length - 3}</div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Подсказка если нет классов */}
          {classes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-gray-500">
                <Code size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Начните создавать архитектуру игры</p>
                <p className="text-sm">Добавьте классы из боковой панели</p>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameArchitectureDesigner;
