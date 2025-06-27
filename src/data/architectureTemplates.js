// src/data/architectureTemplates.js

export const architectureTemplates = {
	mvc: {
		name: "MVC (Model-View-Controller)",
		description: "Классическая архитектура разделения данных, представления и логики",
		icon: "🏗️",
		classes: [
			{
				id: "game-model",
				name: "GameModel",
				category: "Gameplay",
				position: { x: 100, y: 100 },
				properties: [
					{ name: "gameState", type: "GameState", visibility: "private" },
					{ name: "score", type: "int", visibility: "private" },
					{ name: "level", type: "int", visibility: "private" },
					{ name: "isGameOver", type: "boolean", visibility: "private" },
				],
				methods: [
					{ name: "updateScore", params: "points: int", returnType: "void", visibility: "public" },
					{ name: "nextLevel", params: "", returnType: "void", visibility: "public" },
					{ name: "resetGame", params: "", returnType: "void", visibility: "public" },
					{ name: "getGameState", params: "", returnType: "GameState", visibility: "public" },
				],
			},
			{
				id: "game-view",
				name: "GameView",
				category: "Gameplay",
				position: { x: 400, y: 100 },
				properties: [
					{ name: "uiElements", type: "List<UIElement>", visibility: "private" },
					{ name: "canvas", type: "Canvas", visibility: "private" },
					{ name: "camera", type: "Camera", visibility: "private" },
				],
				methods: [
					{ name: "render", params: "", returnType: "void", visibility: "public" },
					{ name: "updateUI", params: "gameState: GameState", returnType: "void", visibility: "public" },
					{ name: "showGameOver", params: "", returnType: "void", visibility: "public" },
					{ name: "showMainMenu", params: "", returnType: "void", visibility: "public" },
				],
			},
			{
				id: "game-controller",
				name: "GameController",
				category: "Gameplay",
				position: { x: 250, y: 300 },
				properties: [
					{ name: "model", type: "GameModel", visibility: "private" },
					{ name: "view", type: "GameView", visibility: "private" },
					{ name: "inputHandler", type: "InputHandler", visibility: "private" },
				],
				methods: [
					{ name: "initialize", params: "", returnType: "void", visibility: "public" },
					{ name: "update", params: "deltaTime: float", returnType: "void", visibility: "public" },
					{ name: "handleInput", params: "input: InputData", returnType: "void", visibility: "private" },
					{ name: "gameLoop", params: "", returnType: "void", visibility: "private" },
				],
			},
			{
				id: "input-handler",
				name: "InputHandler",
				category: "System",
				position: { x: 550, y: 300 },
				properties: [
					{ name: "touchInputs", type: "List<TouchInput>", visibility: "private" },
					{ name: "keyboardInputs", type: "List<KeyInput>", visibility: "private" },
				],
				methods: [
					{ name: "processTouch", params: "touch: TouchInput", returnType: "void", visibility: "public" },
					{ name: "processKeyboard", params: "key: KeyInput", returnType: "void", visibility: "public" },
					{ name: "getInputData", params: "", returnType: "InputData", visibility: "public" },
				],
			},
		],
		connections: [
			{ id: "mvc-1", from: "game-controller", to: "game-model", type: "uses", label: "updates" },
			{ id: "mvc-2", from: "game-controller", to: "game-view", type: "uses", label: "renders" },
			{ id: "mvc-3", from: "game-controller", to: "input-handler", type: "uses", label: "processes" },
			{ id: "mvc-4", from: "game-view", to: "game-model", type: "uses", label: "reads state" },
		],
	},

	mvvm: {
		name: "MVVM (Model-View-ViewModel)",
		description: "Архитектура с двусторонней привязкой данных для мобильных игр",
		icon: "🔄",
		classes: [
			{
				id: "game-model-mvvm",
				name: "GameModel",
				category: "Gameplay",
				position: { x: 100, y: 150 },
				properties: [
					{ name: "playerData", type: "PlayerData", visibility: "private" },
					{ name: "gameProgress", type: "GameProgress", visibility: "private" },
					{ name: "achievements", type: "List<Achievement>", visibility: "private" },
				],
				methods: [
					{ name: "saveProgress", params: "", returnType: "void", visibility: "public" },
					{ name: "loadProgress", params: "", returnType: "void", visibility: "public" },
					{ name: "unlockAchievement", params: "id: string", returnType: "void", visibility: "public" },
				],
			},
			{
				id: "game-viewmodel",
				name: "GameViewModel",
				category: "Gameplay",
				position: { x: 300, y: 50 },
				properties: [
					{ name: "model", type: "GameModel", visibility: "private" },
					{ name: "observableScore", type: "ObservableField<int>", visibility: "public" },
					{ name: "observableLevel", type: "ObservableField<int>", visibility: "public" },
					{ name: "observableGameState", type: "ObservableField<GameState>", visibility: "public" },
				],
				methods: [
					{ name: "bindToModel", params: "", returnType: "void", visibility: "private" },
					{ name: "onScoreChanged", params: "newScore: int", returnType: "void", visibility: "private" },
					{ name: "executeCommand", params: "command: ICommand", returnType: "void", visibility: "public" },
				],
			},
			{
				id: "game-view-mvvm",
				name: "GameView",
				category: "Gameplay",
				position: { x: 500, y: 150 },
				properties: [
					{ name: "viewModel", type: "GameViewModel", visibility: "private" },
					{ name: "dataBinding", type: "DataBinding", visibility: "private" },
					{ name: "uiComponents", type: "List<UIComponent>", visibility: "private" },
				],
				methods: [
					{ name: "bindToViewModel", params: "", returnType: "void", visibility: "private" },
					{ name: "onDataChanged", params: "property: string, value: object", returnType: "void", visibility: "private" },
					{ name: "render", params: "", returnType: "void", visibility: "public" },
				],
			},
			{
				id: "data-binding",
				name: "DataBinding",
				category: "System",
				position: { x: 300, y: 300 },
				properties: [
					{ name: "bindings", type: "Map<string, Binding>", visibility: "private" },
					{ name: "observers", type: "List<IObserver>", visibility: "private" },
				],
				methods: [
					{ name: "bind", params: "property: string, target: object", returnType: "void", visibility: "public" },
					{ name: "notify", params: "property: string, value: object", returnType: "void", visibility: "public" },
					{ name: "unbind", params: "property: string", returnType: "void", visibility: "public" },
				],
			},
		],
		connections: [
			{ id: "mvvm-1", from: "game-viewmodel", to: "game-model-mvvm", type: "uses", label: "observes" },
			{ id: "mvvm-2", from: "game-view-mvvm", to: "game-viewmodel", type: "uses", label: "binds to" },
			{ id: "mvvm-3", from: "game-view-mvvm", to: "data-binding", type: "uses", label: "uses" },
			{ id: "mvvm-4", from: "data-binding", to: "game-viewmodel", type: "uses", label: "notifies" },
		],
	},

	ecs: {
		name: "ECS (Entity-Component-System)",
		description: "Компонентная архитектура для высокопроизводительных игр",
		icon: "⚙️",
		classes: [
			{
				id: "entity-manager",
				name: "EntityManager",
				category: "System",
				position: { x: 300, y: 50 },
				properties: [
					{ name: "entities", type: "List<Entity>", visibility: "private" },
					{ name: "nextEntityId", type: "int", visibility: "private" },
					{ name: "deadEntities", type: "Queue<Entity>", visibility: "private" },
				],
				methods: [
					{ name: "createEntity", params: "", returnType: "Entity", visibility: "public" },
					{ name: "destroyEntity", params: "entity: Entity", returnType: "void", visibility: "public" },
					{ name: "getEntity", params: "id: int", returnType: "Entity", visibility: "public" },
					{ name: "cleanup", params: "", returnType: "void", visibility: "private" },
				],
			},
			{
				id: "component-manager",
				name: "ComponentManager",
				category: "System",
				position: { x: 100, y: 200 },
				properties: [
					{ name: "componentPools", type: "Map<Type, ComponentPool>", visibility: "private" },
					{ name: "entityComponents", type: "Map<Entity, List<Component>>", visibility: "private" },
				],
				methods: [
					{ name: "addComponent", params: "entity: Entity, component: T", returnType: "T", visibility: "public" },
					{ name: "getComponent", params: "entity: Entity", returnType: "T", visibility: "public" },
					{ name: "removeComponent", params: "entity: Entity", returnType: "void", visibility: "public" },
					{ name: "hasComponent", params: "entity: Entity", returnType: "boolean", visibility: "public" },
				],
			},
			{
				id: "transform-component",
				name: "TransformComponent",
				category: "Gameplay",
				position: { x: 50, y: 350 },
				properties: [
					{ name: "position", type: "Vector3", visibility: "public" },
					{ name: "rotation", type: "Quaternion", visibility: "public" },
					{ name: "scale", type: "Vector3", visibility: "public" },
				],
				methods: [
					{ name: "translate", params: "delta: Vector3", returnType: "void", visibility: "public" },
					{ name: "rotate", params: "angles: Vector3", returnType: "void", visibility: "public" },
					{ name: "getWorldMatrix", params: "", returnType: "Matrix4x4", visibility: "public" },
				],
			},
			{
				id: "render-component",
				name: "RenderComponent",
				category: "Gameplay",
				position: { x: 200, y: 350 },
				properties: [
					{ name: "mesh", type: "Mesh", visibility: "public" },
					{ name: "material", type: "Material", visibility: "public" },
					{ name: "isVisible", type: "boolean", visibility: "public" },
				],
				methods: [
					{ name: "setMesh", params: "mesh: Mesh", returnType: "void", visibility: "public" },
					{ name: "setMaterial", params: "material: Material", returnType: "void", visibility: "public" },
				],
			},
			{
				id: "movement-system",
				name: "MovementSystem",
				category: "System",
				position: { x: 500, y: 200 },
				properties: [
					{ name: "entities", type: "List<Entity>", visibility: "private" },
					{ name: "componentManager", type: "ComponentManager", visibility: "private" },
				],
				methods: [
					{ name: "update", params: "deltaTime: float", returnType: "void", visibility: "public" },
					{ name: "processEntity", params: "entity: Entity", returnType: "void", visibility: "private" },
					{ name: "addEntity", params: "entity: Entity", returnType: "void", visibility: "public" },
				],
			},
			{
				id: "render-system",
				name: "RenderSystem",
				category: "System",
				position: { x: 650, y: 200 },
				properties: [
					{ name: "renderer", type: "Renderer", visibility: "private" },
					{ name: "camera", type: "Camera", visibility: "private" },
					{ name: "renderQueue", type: "List<RenderData>", visibility: "private" },
				],
				methods: [
					{ name: "render", params: "", returnType: "void", visibility: "public" },
					{ name: "cullEntities", params: "", returnType: "void", visibility: "private" },
					{ name: "sortByDepth", params: "", returnType: "void", visibility: "private" },
				],
			},
		],
		connections: [
			{ id: "ecs-1", from: "entity-manager", to: "component-manager", type: "uses", label: "manages" },
			{ id: "ecs-2", from: "component-manager", to: "transform-component", type: "contains", label: "manages" },
			{ id: "ecs-3", from: "component-manager", to: "render-component", type: "contains", label: "manages" },
			{ id: "ecs-4", from: "movement-system", to: "component-manager", type: "uses", label: "queries" },
			{ id: "ecs-5", from: "render-system", to: "component-manager", type: "uses", label: "queries" },
			{ id: "ecs-6", from: "movement-system", to: "transform-component", type: "uses", label: "updates" },
			{ id: "ecs-7", from: "render-system", to: "render-component", type: "uses", label: "renders" },
		],
	},

	statemachine: {
		name: "State Machine Pattern",
		description: "Паттерн конечных автоматов для управления игровыми состояниями",
		icon: "🔄",
		classes: [
			{
				id: "game-state-machine",
				name: "GameStateMachine",
				category: "Gameplay",
				position: { x: 300, y: 100 },
				properties: [
					{ name: "currentState", type: "IGameState", visibility: "private" },
					{ name: "states", type: "Map<string, IGameState>", visibility: "private" },
					{ name: "stateHistory", type: "Stack<IGameState>", visibility: "private" },
				],
				methods: [
					{ name: "changeState", params: "stateName: string", returnType: "void", visibility: "public" },
					{ name: "addState", params: "name: string, state: IGameState", returnType: "void", visibility: "public" },
					{ name: "update", params: "deltaTime: float", returnType: "void", visibility: "public" },
					{ name: "goBack", params: "", returnType: "void", visibility: "public" },
				],
			},
			{
				id: "igame-state",
				name: "IGameState",
				category: "Gameplay",
				position: { x: 100, y: 100 },
				properties: [],
				methods: [
					{ name: "enter", params: "", returnType: "void", visibility: "public" },
					{ name: "exit", params: "", returnType: "void", visibility: "public" },
					{ name: "update", params: "deltaTime: float", returnType: "void", visibility: "public" },
					{ name: "handleInput", params: "input: InputData", returnType: "void", visibility: "public" },
				],
			},
			{
				id: "menu-state",
				name: "MenuState",
				category: "Gameplay",
				position: { x: 50, y: 250 },
				properties: [
					{ name: "menuUI", type: "MenuUI", visibility: "private" },
					{ name: "selectedOption", type: "int", visibility: "private" },
				],
				methods: [
					{ name: "enter", params: "", returnType: "void", visibility: "public" },
					{ name: "exit", params: "", returnType: "void", visibility: "public" },
					{ name: "update", params: "deltaTime: float", returnType: "void", visibility: "public" },
					{ name: "handleInput", params: "input: InputData", returnType: "void", visibility: "public" },
				],
			},
			{
				id: "gameplay-state",
				name: "GameplayState",
				category: "Gameplay",
				position: { x: 200, y: 250 },
				properties: [
					{ name: "gameWorld", type: "GameWorld", visibility: "private" },
					{ name: "player", type: "Player", visibility: "private" },
					{ name: "isPaused", type: "boolean", visibility: "private" },
				],
				methods: [
					{ name: "enter", params: "", returnType: "void", visibility: "public" },
					{ name: "exit", params: "", returnType: "void", visibility: "public" },
					{ name: "update", params: "deltaTime: float", returnType: "void", visibility: "public" },
					{ name: "handleInput", params: "input: InputData", returnType: "void", visibility: "public" },
				],
			},
			{
				id: "pause-state",
				name: "PauseState",
				category: "Gameplay",
				position: { x: 350, y: 250 },
				properties: [
					{ name: "pauseUI", type: "PauseUI", visibility: "private" },
					{ name: "backgroundState", type: "IGameState", visibility: "private" },
				],
				methods: [
					{ name: "enter", params: "", returnType: "void", visibility: "public" },
					{ name: "exit", params: "", returnType: "void", visibility: "public" },
					{ name: "update", params: "deltaTime: float", returnType: "void", visibility: "public" },
					{ name: "handleInput", params: "input: InputData", returnType: "void", visibility: "public" },
				],
			},
			{
				id: "gameover-state",
				name: "GameOverState",
				category: "Gameplay",
				position: { x: 500, y: 250 },
				properties: [
					{ name: "gameOverUI", type: "GameOverUI", visibility: "private" },
					{ name: "finalScore", type: "int", visibility: "private" },
					{ name: "isHighScore", type: "boolean", visibility: "private" },
				],
				methods: [
					{ name: "enter", params: "", returnType: "void", visibility: "public" },
					{ name: "exit", params: "", returnType: "void", visibility: "public" },
					{ name: "update", params: "deltaTime: float", returnType: "void", visibility: "public" },
					{ name: "handleInput", params: "input: InputData", returnType: "void", visibility: "public" },
				],
			},
		],
		connections: [
			{ id: "sm-1", from: "game-state-machine", to: "igame-state", type: "uses", label: "manages" },
			{ id: "sm-2", from: "menu-state", to: "igame-state", type: "extends", label: "implements" },
			{ id: "sm-3", from: "gameplay-state", to: "igame-state", type: "extends", label: "implements" },
			{ id: "sm-4", from: "pause-state", to: "igame-state", type: "extends", label: "implements" },
			{ id: "sm-5", from: "gameover-state", to: "igame-state", type: "extends", label: "implements" },
			{ id: "sm-6", from: "game-state-machine", to: "menu-state", type: "contains", label: "contains" },
			{ id: "sm-7", from: "game-state-machine", to: "gameplay-state", type: "contains", label: "contains" },
			{ id: "sm-8", from: "game-state-machine", to: "pause-state", type: "contains", label: "contains" },
			{ id: "sm-9", from: "game-state-machine", to: "gameover-state", type: "contains", label: "contains" },
		],
	},

	observer: {
		name: "Observer Pattern",
		description: "Паттерн наблюдатель для системы событий в игре",
		icon: "👁️",
		classes: [
			{
				id: "event-manager",
				name: "EventManager",
				category: "System",
				position: { x: 300, y: 100 },
				properties: [
					{ name: "observers", type: "Map<EventType, List<IObserver>>", visibility: "private" },
					{ name: "eventQueue", type: "Queue<GameEvent>", visibility: "private" },
					{ name: "isProcessingEvents", type: "boolean", visibility: "private" },
				],
				methods: [
					{ name: "subscribe", params: "eventType: EventType, observer: IObserver", returnType: "void", visibility: "public" },
					{ name: "unsubscribe", params: "eventType: EventType, observer: IObserver", returnType: "void", visibility: "public" },
					{ name: "notify", params: "event: GameEvent", returnType: "void", visibility: "public" },
					{ name: "processEvents", params: "", returnType: "void", visibility: "public" },
				],
			},
			{
				id: "iobserver",
				name: "IObserver",
				category: "System",
				position: { x: 100, y: 100 },
				properties: [],
				methods: [{ name: "onNotify", params: "event: GameEvent", returnType: "void", visibility: "public" }],
			},
			{
				id: "game-event",
				name: "GameEvent",
				category: "System",
				position: { x: 500, y: 100 },
				properties: [
					{ name: "type", type: "EventType", visibility: "public" },
					{ name: "data", type: "Dictionary", visibility: "public" },
					{ name: "timestamp", type: "float", visibility: "public" },
					{ name: "sender", type: "object", visibility: "public" },
				],
				methods: [
					{ name: "getData", params: "key: string", returnType: "T", visibility: "public" },
					{ name: "setData", params: "key: string, value: object", returnType: "void", visibility: "public" },
				],
			},
			{
				id: "score-manager",
				name: "ScoreManager",
				category: "Gameplay",
				position: { x: 150, y: 250 },
				properties: [
					{ name: "currentScore", type: "int", visibility: "private" },
					{ name: "highScore", type: "int", visibility: "private" },
					{ name: "multiplier", type: "float", visibility: "private" },
				],
				methods: [
					{ name: "onNotify", params: "event: GameEvent", returnType: "void", visibility: "public" },
					{ name: "addScore", params: "points: int", returnType: "void", visibility: "private" },
					{ name: "resetScore", params: "", returnType: "void", visibility: "public" },
					{ name: "saveHighScore", params: "", returnType: "void", visibility: "private" },
				],
			},
			{
				id: "ui-manager",
				name: "UIManager",
				category: "System",
				position: { x: 300, y: 250 },
				properties: [
					{ name: "scoreDisplay", type: "Text", visibility: "private" },
					{ name: "healthBar", type: "ProgressBar", visibility: "private" },
					{ name: "messagePanel", type: "Panel", visibility: "private" },
				],
				methods: [
					{ name: "onNotify", params: "event: GameEvent", returnType: "void", visibility: "public" },
					{ name: "updateScore", params: "score: int", returnType: "void", visibility: "private" },
					{ name: "updateHealth", params: "health: float", returnType: "void", visibility: "private" },
					{ name: "showMessage", params: "message: string", returnType: "void", visibility: "private" },
				],
			},
			{
				id: "audio-manager",
				name: "AudioManager",
				category: "System",
				position: { x: 450, y: 250 },
				properties: [
					{ name: "soundEffects", type: "Map<string, AudioClip>", visibility: "private" },
					{ name: "musicTracks", type: "Map<string, AudioClip>", visibility: "private" },
					{ name: "masterVolume", type: "float", visibility: "private" },
				],
				methods: [
					{ name: "onNotify", params: "event: GameEvent", returnType: "void", visibility: "public" },
					{ name: "playSound", params: "soundName: string", returnType: "void", visibility: "private" },
					{ name: "playMusic", params: "trackName: string", returnType: "void", visibility: "private" },
					{ name: "stopAllSounds", params: "", returnType: "void", visibility: "public" },
				],
			},
		],
		connections: [
			{ id: "obs-1", from: "event-manager", to: "iobserver", type: "uses", label: "notifies" },
			{ id: "obs-2", from: "event-manager", to: "game-event", type: "uses", label: "processes" },
			{ id: "obs-3", from: "score-manager", to: "iobserver", type: "extends", label: "implements" },
			{ id: "obs-4", from: "ui-manager", to: "iobserver", type: "extends", label: "implements" },
			{ id: "obs-5", from: "audio-manager", to: "iobserver", type: "extends", label: "implements" },
			{ id: "obs-6", from: "event-manager", to: "score-manager", type: "related", label: "notifies" },
			{ id: "obs-7", from: "event-manager", to: "ui-manager", type: "related", label: "notifies" },
			{ id: "obs-8", from: "event-manager", to: "audio-manager", type: "related", label: "notifies" },
		],
	},

	command: {
		name: "Command Pattern",
		description: "Паттерн команда для обработки действий игрока с возможностью отмены",
		icon: "⚡",
		classes: [
			{
				id: "command-manager",
				name: "CommandManager",
				category: "System",
				position: { x: 300, y: 100 },
				properties: [
					{ name: "commandHistory", type: "Stack<ICommand>", visibility: "private" },
					{ name: "redoStack", type: "Stack<ICommand>", visibility: "private" },
					{ name: "maxHistorySize", type: "int", visibility: "private" },
				],
				methods: [
					{ name: "executeCommand", params: "command: ICommand", returnType: "void", visibility: "public" },
					{ name: "undo", params: "", returnType: "void", visibility: "public" },
					{ name: "redo", params: "", returnType: "void", visibility: "public" },
					{ name: "clearHistory", params: "", returnType: "void", visibility: "public" },
				],
			},
			{
				id: "icommand",
				name: "ICommand",
				category: "System",
				position: { x: 100, y: 100 },
				properties: [],
				methods: [
					{ name: "execute", params: "", returnType: "void", visibility: "public" },
					{ name: "undo", params: "", returnType: "void", visibility: "public" },
					{ name: "canUndo", params: "", returnType: "boolean", visibility: "public" },
				],
			},
			{
				id: "move-command",
				name: "MoveCommand",
				category: "Gameplay",
				position: { x: 50, y: 250 },
				properties: [
					{ name: "player", type: "Player", visibility: "private" },
					{ name: "direction", type: "Vector3", visibility: "private" },
					{ name: "previousPosition", type: "Vector3", visibility: "private" },
				],
				methods: [
					{ name: "execute", params: "", returnType: "void", visibility: "public" },
					{ name: "undo", params: "", returnType: "void", visibility: "public" },
					{ name: "canUndo", params: "", returnType: "boolean", visibility: "public" },
				],
			},
			{
				id: "attack-command",
				name: "AttackCommand",
				category: "Gameplay",
				position: { x: 200, y: 250 },
				properties: [
					{ name: "attacker", type: "Player", visibility: "private" },
					{ name: "target", type: "Enemy", visibility: "private" },
					{ name: "damage", type: "int", visibility: "private" },
					{ name: "wasTargetAlive", type: "boolean", visibility: "private" },
				],
				methods: [
					{ name: "execute", params: "", returnType: "void", visibility: "public" },
					{ name: "undo", params: "", returnType: "void", visibility: "public" },
					{ name: "canUndo", params: "", returnType: "boolean", visibility: "public" },
				],
			},
			{
				id: "buy-item-command",
				name: "BuyItemCommand",
				category: "Gameplay",
				position: { x: 350, y: 250 },
				properties: [
					{ name: "player", type: "Player", visibility: "private" },
					{ name: "item", type: "Item", visibility: "private" },
					{ name: "cost", type: "int", visibility: "private" },
					{ name: "inventory", type: "Inventory", visibility: "private" },
				],
				methods: [
					{ name: "execute", params: "", returnType: "void", visibility: "public" },
					{ name: "undo", params: "", returnType: "void", visibility: "public" },
					{ name: "canUndo", params: "", returnType: "boolean", visibility: "public" },
				],
			},
			{
				id: "input-handler-cmd",
				name: "InputHandler",
				category: "System",
				position: { x: 500, y: 150 },
				properties: [
					{ name: "commandManager", type: "CommandManager", visibility: "private" },
					{ name: "keyBindings", type: "Map<KeyCode, ICommand>", visibility: "private" },
				],
				methods: [
					{ name: "handleInput", params: "input: InputData", returnType: "void", visibility: "public" },
					{ name: "bindKey", params: "key: KeyCode, command: ICommand", returnType: "void", visibility: "public" },
					{ name: "createCommand", params: "action: ActionType", returnType: "ICommand", visibility: "private" },
				],
			},
		],
		connections: [
			{ id: "cmd-1", from: "command-manager", to: "icommand", type: "uses", label: "executes" },
			{ id: "cmd-2", from: "move-command", to: "icommand", type: "extends", label: "implements" },
			{ id: "cmd-3", from: "attack-command", to: "icommand", type: "extends", label: "implements" },
			{ id: "cmd-4", from: "buy-item-command", to: "icommand", type: "extends", label: "implements" },
			{ id: "cmd-5", from: "input-handler-cmd", to: "command-manager", type: "uses", label: "sends to" },
			{ id: "cmd-6", from: "input-handler-cmd", to: "icommand", type: "creates", label: "creates" },
		],
	},
};

export const getTemplatesList = () => {
	return Object.keys(architectureTemplates).map((key) => ({
		id: key,
		...architectureTemplates[key],
	}));
};
