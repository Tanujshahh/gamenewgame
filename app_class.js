/*
 * Copyright (c) 2015-2016. Docentron PTY LTD. All rights reserved.
 * This material may not be reproduced, displayed, modified or distributed without
 * the express prior written permission of the copyright holder.
 */

// Customise state classes in this file for your game
// Extend/customise the states defined here

/**************************************************************************************************************
 **************************************************************************************************************
 * Entry point of the game app
 * This is automatically called when the application is loaded.
 **************************************************************************************************************
 **************************************************************************************************************/
window["ibsgl"] = ibStartGameLevel;         // Do not change this line
window["startDCApp"] = function(){ ibStartGameLevel("game_stage_one"); }; // DEVELOPER_CODE
function ibStartGameLevel(gameContainer) {
    //-----------------------------------------------
    Genari.configSystem();

    //-----------------------------------------------
    // Create the game object. The only game object. This is not a Phaser object.
    // Do not change these lines
    Genari.dcGame = Genari.dcGame || new MazeGame(game_themes);

    //-----------------------------------------------
    // Configure the game object
    var ga = Genari.dcGame;

    // Define constants and theme asset keys here.
    // It is easier to refactor later.

    // We can override default asset keys here
    ga.pistolBulletImgKey = "pistolBulletImg";
    ga.laserGunBulletImgKey = "laserGunBulletImg";
    ga.machineGunBulletImgKey = "machineGunBulletImg";
    ga.sniperBulletImgKey = "sniperBulletImg";
    ga.cannonBulletImgKey = "cannonBulletImg";
    ga.bossAttackImageKey = "bossAttackImg";
    ga.treasureBoxImgKey = 'treasureBoxImg';
    ga.treasureBoxLayerKey = 'treasures';

    ga.pistolWeaponImgKey = "pistolGunBtnSprite";
    ga.laserGunWeaponImgKey = "laserGunBtnSprite";
    ga.machineGunWeaponImgKey = "machineGunBtnSprite";
    ga.sniperWeaponImgKey = "sniperBtnSprite";
    ga.cannonWeaponImgKey = "cannonBtnSprite";

    ga.miniMapImageKey = "miniMapImg";
    ga.healthFrameImgKey = "healthBarFrameImg";
    ga.healthBarImgKey = "healthBarImg";
    ga.powerFrameImgKey = "powerBarFrameImg";
    ga.powerBarImgKey = "powerBarImg";
    ga.dragonHealthBarSpriteKey = "dragonHealthBarSprite";
    ga.supplyBoxSpriteKey = "supplyBoxImg";
    ga.supplyCaseSpriteKey = "supplyCaseImg";
    ga.ammoSpriteKey = "ammoImg";
    ga.medicineSpriteKey = "medicineImg";

    ga.easyDefeatMonsterSpriteKey = "monsterEasySprite";
    ga.mediocreDefeatMonsterSpriteKey = "monsterMediocreSprite";
    ga.mediumDefeatMonsterSpriteKey = "monsterMediumSprite";
    ga.hardDefeatMonsterSpriteKey = "monsterHardSprite";
    ga.difficultDefeatMonsterSpriteKey = "monsterDifficultSprite";

    ga.enemyAttackSpriteKey = "enemyAttackSprite";
    ga.bossBulletImgKey = "bossBulletImg";
    ga.bossSpriteKey = "bossSprite";
    ga.spaceShipImgKey = "spaceshipImg";

    ga.bulletAssetKey = ga.pistolBulletImgKey;
    ga.smallExplosionSpriteKey = "explosionSmallSprite";
    ga.largeExplosionSpriteKey = "explosionBigSprite";
    ga.bossFireBreathSndKey = "fireBreathSnd";
    ga.enemyFireBulletSndKey = "enemyFireSnd";

    // Load Phaser and preload and create common assets. This calls preload() and create() defined below.
    ga.createPhaser(gameContainer, preload, create, "CANVAS", "ARCADE");

    // Add game states to the game. We need to do this after loading Phaser shown above.
    // We are using 3 game states
    ga.stateMainMenu = new PStateMenu(ga, "menu");  // This is activated in create() to show the splash screen. And then activate PStatePlay to start the game.
    ga.stateError = new PStateError(ga, "error");  // this is not used at the moment
    ga.statePlay = new PStatePlay(ga, "play");  // this is used show the stage and control characters (game levels)

    //---------------------------------------------
    // Download common assets from server. This preload is called only once when the page is loaded.
    // Therefore, add here all necessary common setups you need to do for the game.
    // Avoid adding things in DCPlayState.preload/create() that can be put here and done once.
    // TODO: customise preload and create for your game
    function preload(){
        ga.rescaleGame();

        ga.showLoading('Loading, please wait...');

        // To avoid memory leak, if an asset is no longer needed, must unload by clearing the cache
        // ** if a file (asset) is already loaded, Phaser will not load again.
        // ** Mobile phone browsers have 5M memory limitations

        // preload image and sprite assets
        Genari.loadImageSpriteAssets(game_common_assets["imagesSprites"]);

        // preload common audio
        Genari.loadAudioAssets(game_common_assets["audio"]);
    }

    // Add some assets to the game stage, which then can be shown and played
    function create(){
        //-----------------------------------------------------------
        // Prepare input keys commonly used
        // Add UP/DOWN/LEFT/RIGHT keys
        ga.cursorKeys = Genari.createCursorKeys();  // UP/DOWN/LEFT/RIGHT keys on PC

        // Add enter key. This is used to dismiss dialog boxes using Enter key
        ga.enterKey = ga.enterKey || Genari.addKey("ENTER"); //ga.phaserGame["input"]["keyboard"]["addKey"](Phaser["Keyboard"]["ENTER"]);

        // We can add additional keys if needed like this
        //ga.spaceBarKey = this.spaceBarKey || Genari.addKey("SPACEBAR");

        // add more pointers for multi touch. 2 is Default
        //ga.phaserGame["input"]["addPointer"]();  // 3
        //ga.phaserGame["input"]["addPointer"]();  // 4

        ga.addAudioFromList(game_common_assets["audio"]);

        // Shouldn't this be moved out?
        ga.stateMainMenu.start(); // this will call gaStateMenuState.preload() and create()

        // Load game score and hide the loading message
        Genari.loadScore();
    }
}

/**************************************************************
 * Controls class for running games.
 * Manage all keyboard controls and on-screen button or joystick controls
 * Modify or extend this for your own game.
 * @param {MazeGame} theGameObj The only game object
 * @param {Genari.MazePlayer} player The player character that user controls
 *
 * @constructor
 * @extends {Genari.Control}
 **************************************************************/
var DCMazeControl = function(theGameObj, player){
    if( !(this instanceof DCMazeControl)){
        return new DCMazeControl(theGameObj, player); // Make sure we create the right class
    }

    // Call superclass constructor, which will add its attributes and configure them.
    Genari.Control.call(this, theGameObj, player);   // must call the parent class.
    // Never redefine inherited properties and methods.
    // To override methods, must use prototype.
    this.player = player;       // DEVELOPER_CODE
    // Constants
    this.BUTTON_WIDTH = 75;
    this.BUTTON_EDGE_MARGIN = 10;

    this.isShootDown = false;
    this.bulletCount=0;

    this.createControls();

};
DCMazeControl.prototype = Object.create(Genari.Control.prototype); // extend DCControl
DCMazeControl.prototype.constructor = DCMazeControl;  // set constructor property

/**
 * Create on-screen button controls for the run game
 * @public
 **/
DCMazeControl.prototype.createControls = function() {
    var ga=this.dcGame;
    // Prevent event propagation of certain keys. Certain keys can interfere with browser.
    Genari.phaserAddKeyCapture("SPACEBAR");

    // Destroy any existing buttons
    this.destroyControlButtons();

    this.addControlButton(
        ga.gc_game_width - this.BUTTON_WIDTH - this.BUTTON_EDGE_MARGIN,
        ga.gc_game_height - this.BUTTON_WIDTH - 25,
        ga.shootButtonSpriteKey,
        function(){this.isShootDown = true;
            ga.groupPlayerBullets.checkBullets();
            if(ga.bulletAssetKey !== ga.pistolBulletImgKey){
                ga.bulletBar.addValue(-1);
            }
        }.bind(this),
        function(){this.isShootDown = false;}.bind(this),
        this
    );

    ga.weapons = [];
    var pistol = this.addControlButton(
        ga.gc_game_width - this.BUTTON_WIDTH - 6*this.BUTTON_EDGE_MARGIN,
        ga.gc_game_height - this.BUTTON_WIDTH+40,
        ga.pistolWeaponImgKey,
        function(){if (ga.weapon) {
            ga.groupPlayerBullets.changeBullet(ga.weapon,ga.pistolBulletImgKey,ga.weaponBulletCount);
        }}.bind(this),
        function(){}.bind(this),
        this
    );
    pistol["visible"] = pistol["input"]["useHandCursor"] = pistol.enable = ga.weapon;
    ga.weapons.push(pistol);

    var laserGun = this.addControlButton(
        ga.gc_game_width - this.BUTTON_WIDTH - 6*this.BUTTON_EDGE_MARGIN,
        ga.gc_game_height - this.BUTTON_WIDTH,
        ga.laserGunWeaponImgKey,
        function(){if (ga.laserGun) {
            ga.groupPlayerBullets.changeBullet(ga.laserGun,ga.laserGunBulletImgKey,ga.laserGunBulletCount);
        }}.bind(this),
        function(){}.bind(this),
        this
    );
    laserGun["visible"] = laserGun["input"]["useHandCursor"] = ga.laserGun;
    ga.weapons.push(laserGun);

    var machineGun = this.addControlButton(
        ga.gc_game_width - this.BUTTON_WIDTH - 5*this.BUTTON_EDGE_MARGIN,
        ga.gc_game_height - this.BUTTON_WIDTH-40,
        ga.machineGunWeaponImgKey,
        function(){if (ga.machineGun) {
            ga.groupPlayerBullets.changeBullet(ga.machineGun,ga.machineGunBulletImgKey,ga.machineGunBulletCount);
        }}.bind(this),
        function(){}.bind(this),
        this
    );
    machineGun["visible"] = machineGun["input"]["useHandCursor"] = ga.machineGun;
    ga.weapons.push(machineGun);

    var sniper = this.addControlButton(
        ga.gc_game_width - this.BUTTON_WIDTH - this.BUTTON_EDGE_MARGIN,
        ga.gc_game_height - this.BUTTON_WIDTH - 50,
        ga.sniperWeaponImgKey,
        function(){if (ga.sniper) {
            ga.groupPlayerBullets.changeBullet(ga.sniper,ga.sniperBulletImgKey,ga.sniperBulletCount);
        }}.bind(this),
        function(){}.bind(this),
        this
    );
    sniper["visible"] = sniper["input"]["useHandCursor"] = ga.sniper;
    ga.weapons.push(sniper);

    var cannon = this.addControlButton(
        ga.gc_game_width - this.BUTTON_WIDTH - this.BUTTON_EDGE_MARGIN+50,
        ga.gc_game_height - this.BUTTON_WIDTH - 50,
        ga.cannonWeaponImgKey,
        function(){
            if (ga.cannon) {
                ga.groupPlayerBullets.changeBullet(ga.cannon,ga.cannonBulletImgKey,ga.cannonBulletCount);
            }
        }.bind(this),
        function(){}.bind(this),
        this
    );
    cannon["visible"] = cannon["input"]["useHandCursor"] = ga.cannon;
    ga.weapons.push(cannon);
    // Now add click event handlers for the buttons.
    // Due to bug in Phaser, we must call this whenever we resize the window
    this.createButtonHitArea();

    //--------------------------
    // create a joystick if you need one
    // see this.update on how to use the joystick state to control the game
    Genari.createJoyStick(
        0.5, // alpha
        22,  // offset
        30,  // x
        Genari.dcGame.gc_ground_height + 30,  // y
        'joystick_base', 'joystick_stick');
};

DCMazeControl.prototype.setWeaponSelector = function(bulletKey) {
    this.dcGame.weapons.forEach(function(weapon) {
        if (weapon["key"] === bulletKey) {
            this.dcGame.selectedWeapon = bulletKey;
            weapon["frame"] = 1;
        }
        else weapon["frame"] = 0;
    }.bind(this));
};
/**
 * Update button control states. Call this from play-state.update()
 */
DCMazeControl.prototype.update = function() {
    var ga=this.dcGame;
    //---------------------------
    // Update joystick and get its direction
    var jtstate = Genari.updateJoyStick();
    this.stickLeftRight = jtstate[0];  // + if right, - if left
    this.stickUpDown = jtstate[1];     // + if up, - if down

    // Shoot
    if (this.isFirstClick( Genari.checkKeyDown("SPACEBAR"))){
        ga.groupPlayerBullets.checkBullets();
        if(ga.bulletAssetKey !== ga.pistolBulletImgKey){
            ga.bulletBar.addValue(-1);
        }
    }
    else if(!this.isShootDown) ga.groupPlayerBullets.bulletCount = 0;
};

/***********************************************************************************
 * The game class. There should be only one Game object. * This is not Phaser.Game object.
 * Use this to implement your game by modifying this or extending it
 * Avoid overriding methods unless necessary.
 * See annotation doc: https://developers.google.com/closure/compiler/docs/js-for-compiler#tags
 *
 * @constructor
 * @extends {Genari.Game}
 ***********************************************************************************/
var MazeGame = function(game_themes){
    if( !(this instanceof MazeGame)) return new MazeGame();
    Genari.Game.call(this, game_themes, 800, 432); // call the parent constructor

    this.gc_life_icon_x = 90;
    this.gc_life_text_x = 127;

    this.gc_ground_height = this.gc_game_height/1.4516; //310; // gaHeight
    this.gc_player_fall_line = this.gc_ground_height + (this.gc_game_height - this.gc_ground_height)/2; //380; // if player hit this line, die

    this.gc_score_text_x = this.gc_game_width - 60;
    this.gc_score_icon_x = this.gc_score_text_x - 35;

    this.enemyVelocity = 40; // determine the speed of the monsters

    // Create groups for interactive display objects for the game to manage collisions
    this.groupPlatform = null;
    this.groupBullets = null;
    this.groupCorrectBox = null;
    this.groupIncorrectBox = null;

    this.weapons = [];
    this.selectedWeapon = "";
    //Bullet enabled for each weapon.
    this.weapon = true;
    this.laserGun = false;
    this.machineGun = false;
    this.sniper = false;
    this.cannon = false;
    //Bullet count for each weapon.
    this.weaponBulletCount = 50;
    this.laserGunBulletCount = 40;
    this.machineGunBulletCount = 40;
    this.sniperBulletCount = 30;
    this.cannonBulletCount = 20;

    /** @type {Genari.Hud} */
    this.hud = null;

};
MazeGame.prototype = Object.create(Genari.Game.prototype); // extend DBGame
MazeGame.prototype.constructor = MazeGame;  // set constructor property

MazeGame.prototype.updateScore = function (score){
    this.levelScore += parseFloat(score);
    this.scoreBox.gainScore(score);
    //this.scoreText["text"] = this.levelScore;
};

/**
 * Overriding the superclass method createPhaser
 * @override
 **/
MazeGame.prototype.createPhaser = function(gameContainer, preloadFn, createFn, renderMethod, gamePhysics) {
    // ** Make sure to call the parent
    Genari.Game.prototype.createPhaser.call(this, gameContainer, preloadFn, createFn, renderMethod, gamePhysics);

    // Your own stuff here
};

/**
 * Overriding the superclass method restartLevel
 * @override
 * */
MazeGame.prototype.restartLevel = function(){
    // custom settings
    this.bulletAssetKey = this.pistolBulletImgKey;
    // ** Make sure to call the parent
    Genari.Game.prototype.restartLevel.call(this);
};

// Return true if reached end of the game
MazeGame.prototype.checkReachedEnd = function (){
    return (this.levelScore==100);//(!this.groupMonster.getGroup() || this.groupMonster.getGroup()["total"] == 0);
};

// This is how to check the end of the game level for run games
MazeGame.prototype.checkLevelEnd = function (){
    if( this.checkReachedEnd() ) {
        this.enemyVelocity += 5;
        // completed the game. Save game and Go to next level
        // initialize these two before saving
        this.correctWordsCollected = [];
        this.incorrectWordsDestroyed = [];
        this.bulletAssetKey=ga.pistolBulletImgKey;
        this.saveAndStartNextLevel(false);
    }
};

/**
 * This function is overriden so that we can reset some variables when start new game.
 * @override
 */
MazeGame.prototype.startNew = function() {
    //this.audioStop(this.backgroundMusicKey);

    //this.removeGameDialogBox();
    //this.statePlay.isLevelCleared = false;
    //this.statePlay.isPlaying = false; // prevent update calls

    //this.currentGameLevel = 0;
    //this.totalGameScore = 0;
    //this.levelScore = 0;
    //this.phaserGame["paused"] = false;
    //this.gamePaused = false;

    //Bullet enabled for each weapon.
    this.selectedWeapon = "";
    this.weapon = true;
    this.laserGun = false;
    this.machineGun = false;
    this.sniper = false;
    this.cannon = false;

    //Bullet count for each weapon.
    this.weaponBulletCount = 50;
    this.laserGunBulletCount = 40;
    this.machineGunBulletCount = 40;
    this.sniperBulletCount = 30;
    this.cannonBulletCount = 20;
    //this.stateMainMenu.start();

    Genari.Game.prototype.startNew.call(this);
};

// http://phaser.io/docs/2.4.4/Phaser.State.html
// Phaser state. Must use "name" format for these
//   create, initload, Render, loadUpdate, paused, pauseUpdate, preload,
//   preRender, render, resize, resumed, shutdown, update

// Public methods called by Phaser:
//  init is the very first function called when your State starts up. It's called before preload,
//   It's called before preload, create or anything else.
//   If you need to route the game away to another State you could do so here, or
//     if you need to prepare a set of variables or objects before the preloading starts.
//  preload is called first. Normally you'd use this to load your game assets (or those needed for the current State)
//    ** You shouldn't create any objects in this method that require assets that you're also loading in this method,
//       as they won't yet be available.
//  create is called once preload has completed, this includes the loading of any assets from the Loader.
//  preRender method is called after all Game Objects have been updated, but before any rendering takes place.
//  resumed. This method will be called when the core game loop resumes from a paused state.
//  shutdown: This method will be called when the State is shutdown (i.e. you switch to another state from this one).
//  resize: If your game is set to Scalemode RESIZE then each time the browser resizes it will call this function, passing in the new width and height.
//  update: The update method is left empty for your own use.
//    It is called during the core game loop AFTER debug, physics, plugins and the Stage have had their preUpdate methods called.

/**************************************************************
 * Phaser state class for displaying error messages.
 *
 * @constructor
 * @extends {Genari.GameState}
 **************************************************************/
var PStateError = function(theGameObj, key) {
    if (!(this instanceof PStateError)) return new PStateError();
    Genari.GameState.call(this, theGameObj, key); // call parent constructor

    this["preload"] = function() {
    };

    this["create"] = function() {
        var ga = this.dcGame;

        ga.setToBaseScaleMode();

        var error = Genari.phaserAddText(0,0, "Sorry, network error. Please check network connection", {fill:"#ffffff"});
        error["x"] = Genari.calcBoxCenterX(ga.phaserGame["camera"], error);
        error["y"] = Genari.calcBoxCenterY(ga.phaserGame["camera"], error) - 40;
        var bt = Genari.phaserAddButton(0,0,ga.retryButtonSpriteKey,
            function(){
                var ga = this.dcGame;
                ga.startGame();  //ibGetCurrentGameLevel(ga.startGameLevel.bind(ga));
            }.bind(this),
            ga, 0, 1, 2, 1
        );
        bt["x"] = Genari.calcBoxCenterX(ga.phaserGame["camera"], bt);
        bt["y"] = Genari.calcBoxCenterY(ga.phaserGame["camera"], bt) + 40;

        ga.setToScaledMode();
    }.bind(this);
};
PStateError.prototype = Object.create(Genari.GameState.prototype); // extend DBGame
PStateError.prototype.constructor = PStateError;  // set constructor property

/****************************************************************
 * Phaser state class, display splash screen. This is the main Menu
 *
 * @constructor
 * @extends {Genari.GameState}
 ***************************************************************/
var PStateMenu = function(theGameObj, key){
    if( !(this instanceof PStateMenu)) return new PStateMenu();
    Genari.GameState.call(this, theGameObj, key); // call parent constructor

    this.menuAudio = null;

    // override
    this["preload"] = function() {
        // load here any theme specific assets
    }.bind(this);

    // override
    this["create"] = function() {
        // Add here custom initialization for starting a new game.

        // Create theme specific objects for menu state

        var ga = this.dcGame; //GApp.cgame;

        // scale to original scale. ** Must do this
        this.dcGame.setToBaseScaleMode();

        ga.removeGameDialogBox();

        ga.totalGameScore = 0;
        this.menuAudio = Genari.phaserAddAudio(ga.menuMusicKey);
        this.menuAudio["play"]();

        Genari.addBanner();

        // click and Enter will load the game data from the server and start the game (play state)
        ga.addOnceDialogAction(
            function (){
                //console.info("gaSateMenuState.start PStateMenu", this);
                var ga = this.dcGame;
                ga.isLevelCleared = false;
                this.menuAudio["stop"]();
                ga.removeGameDialogBox();
                // Load the game level data from server and start the game level
                ga.startGame(); //ibGetCurrentGameLevel(ga.startGameLevel.bind(ga));
            }.bind(this),
            this
        );

        // Scale to fit the window. ** Must do this
        this.dcGame.setToScaledMode();
    }.bind(this);
};
PStateMenu.prototype = Object.create(Genari.GameState.prototype); // extend DBGame
PStateMenu.prototype.constructor = PStateMenu;  // set constructor property

/**************************************************************
 * Phaser state class, Play state
 * You can extend this class to customise your Play state
 * @param {MazeGame} theGameObj the only game object
 * @param {string} key name of the state E.g., "play"
 *
 * @constructor
 * @extends {Genari.GameState}
 **************************************************************/
var PStatePlay = function(theGameObj, key){
    if( !(this instanceof PStatePlay)) return new PStatePlay(theGameObj, key);
    Genari.GameState.call(this, theGameObj, key); // call parent constructor

    this.dcGame = theGameObj;     // reassign to show info on PHPStorm  DEVELOPER_CODE
    // Game states
    this.isPlaying = false;       // used to prevent update being processed during state transition
    this.isLevelCleared = false;  // is repeating the game?

    // Game assets
    this.explosions = null;       // explosion objects
    this.pauseMenuButtons = [];    // pause menu buttons

    /** @type {Genari.MazePlayer} */
    this.player = null;
    this.x=null;
    this.y=null;

    var ga = this.dcGame; // GApp.cgame;
    this.backgroundWidth = 2200;         // the width of the world

    this["preload"] = function() {
        // Load here any theme specific assets
        ga.showLoading("Loading, please wait...");
        //destroy previous assets/objects loaded

        //console.info("gaStatePlayState.preload"); //, JSON.stringify(ga.levelData));
        if(Genari.getThemeNo() >= 0){
            this.loadThemeAssets();
            Genari.loadLevelAssets();
        }else{
            //console.info("no game data. go to menu state");
            ga.stateMainMenu.start();
        }
    }.bind(this);

    /**
     * Function called by for the state during create stage
     * Add here any level specific initialization code
     * Create theme specific objects for play state
     * @type {function}
     */
    this["create"] = function() {
        //destroy previous assets/objects loaded if any.

        // Layer to control rendering order. You can add your own layers to control z-order.
        if(ga.layerBottom) ga.layerBottom["destroy"](true);
        if(ga.layerPlayer) ga.layerPlayer["destroy"](true);
        if(ga.layerEffects) ga.layerEffects["destroy"](true);
        if(ga.layerButtons) ga.layerButtons["destroy"](true);
        if(ga.layerDialog) ga.layerDialog["destroy"](true);
        // layers are ordered based on the order they are created
        ga.layerBottom = ga.phaserGame["add"]["group"]();    // Use this as the bottom layer, Always show at the button. Holds background, platforms
        ga.layerPickups = ga.phaserGame["add"]["group"]();   // holds player interactive items.
        ga.layerPlayer = ga.phaserGame["add"]["group"]();    // holds player.
        ga.layerMonsters = ga.phaserGame["add"]["group"]();  // holds monsters.
        ga.layerEffects = ga.phaserGame["add"]["group"]();   // holds explosions, bullets, effects
        ga.layerButtons = ga.phaserGame["add"]["group"]();   // holds control buttons, frames, windows, HUD items
        ga.layerDialog = ga.phaserGame["add"]["group"]();    // Always show at the top. Holds dialog boxes. Top layer

        Genari.Effect.setEffectLayer(ga.layerEffects);    // force all effects to be drawn on ga.layerEffects

        //Creating groups for the word boxes and bullets to be placed in.
        if(ga.groupPlatform) ga.groupPlatform.destroy();
        if(ga.groupCorrectBox) ga.groupCorrectBox.destroy();
        if(ga.groupIncorrectBox) ga.groupIncorrectBox.destroy();
        ga.groupPlatform = new Genari.PlatformGroup(ga.layerBottom);     // put all collidable platform items, such as buildings
        ga.groupPickups = new Genari.CoinsGroup(ga.layerPickups);     // put all collidable platform items, such as buildings
        ga.groupCorrectBox = new Genari.MonsterGroup(ga.layerMonsters);    // add correct word boxes here
        ga.groupIncorrectBox = new Genari.MonsterGroup(ga.layerMonsters);  // add incorrect word boxes here
        ga.groupPlayerBullets=new Genari.PlayerBulletGroup(ga.layerEffects);
        ga.groupTreasure = new Genari.TreasureGroup(ga.layerPickups);
        ga.groupCrates=new Genari.CrateGroup(ga.layerPickups);
        ga.groupMonster=new Genari.MonsterGroup(ga.layerMonsters);
        ga.groupBoss=new Genari.BossGroup(ga.layerMonsters);
        ga.groupMonsterBullet=new Genari.MonsterBulletGroup(ga.layerEffects);
        ga.groupWeapon=new Genari.WeaponGroup(ga.layerPickups);
        ga.groupSpaceship=new Genari.SpaceshipGroup(ga.layerPickups);


        Genari.Effect.setEffectLayer(ga.layerEffects);    // force all effects to be drawn on ga.layerEffects

        // Add display objects to the appropriate layers like this when you create them
        // ga.dialogBoxLayer["add"](displayObject);

        // ** Must set scale to the orginal game scale
        ga.setToBaseScaleMode();

        ga.addThemeAudio();
        ga.addLevelAudio();
        //ga.addAudioFromList(Genari.getTheme()["audio"]);  // place some sudio assets for ready play

        this.createWorld();
        ga.playerMaxHealth = 5;
        ga.playerMaxPower = 50;
        this.setPlayerLocation();
        this.player = new Genari.MazePlayer(ga, ga.playerMaxHealth, this.x, this.y);
        // the game, [maxLife, entryX, entryY]
        this.createHud();

        this.createLevelInvaders();
        ga.groupWeapon.createWeapon();
        ga.groupBoss.createDragon();
        ga.groupTreasure.createTreasureBoxes();
        ga.groupCrates.createCrates();

        ga.explosionSmall = Genari.Effect.addExplosion(ga.smallExplosionSpriteKey, "explosion", ga.layerEffects);
        ga.explosionBig = Genari.Effect.addExplosion(ga.largeExplosionSpriteKey, "explosion", ga.layerEffects);

        // create control keys and onscreen control buttons
        ga.gameControl = new DCMazeControl(theGameObj, this.player); // game, player, bullet obj, bullet sound key
        ga.gameControl.hideOnScreenButtons();

        ga.groupPlayerBullets.currentWeapon();
        this.showLevelOpeningDialogBox();

        // scale to fit the window
        ga.setToScaledMode();

        // completed loading the game
        this.isPlaying = true;  // we are now playing the level, Enable update
        ga.hideLoading();
    }.bind(this);

    this["update"] = function() {
        if(!this.isPlaying) return; // game level over

        // must call this
        this.stateCheck();

        this.player.update();

        ga.groupMonster.update();
        ga.groupWeapon.update();
        ga.groupPlayerBullets.update();
        ga.groupMonsterBullet.update();
        ga.groupTreasure.update();
        ga.groupCrates.update();
        ga.groupBoss.update();
        ga.groupSpaceship.update();
        ga.gameControl.update();  // ** place this after collision checks
        this.player.moveZone(); //Move player to different zones


        this.miniMap.drawMonsters(this.dcGame.groupMonster.getGroup());
        // check if game level ended. If ended, save the game and start a new level
        ga.checkLevelEnd();
    }.bind(this);
};
PStatePlay.prototype = Object.create(Genari.GameState.prototype); // extend DBGame
PStatePlay.prototype.constructor = PStatePlay;  // set constructor property

// Define here PStatePlay methods.
//  ** DO NOT include methods in gaStatePlay. No need to use ["key"] format
PStatePlay.prototype.loadThemeAssets = function(){
    //var theme = Genari.getTheme();

    // Load tileMap assets before use
    Genari.loadThemeTileMaps();

    Genari.loadThemeImageSpriteAssets(); // load all images and sprites including tile set images here

    Genari.loadThemeAudioAssets();
    //Genari.loadAudioAssets(theme["audio"]);
};

// Place game assets as display object in the stage
PStatePlay.prototype.createWorld = function(){
    var ga = this.dcGame;

    if(this.background) this.background["destroy"]();

    //ga.phaserGame["world"]["setBounds"](0, 0, 1792, 1008);

    //---------------------------------------------------------
    // Place the loaded tilemap and tileset images to show
    this.addThemeTileMaps(16,16);

    // load the background layer and show. For this game we are using image for the background.
    // uncomment if you want to show the background layer
    this.loadTileMapBackgroundLayer(ga.layerBottom,"background",1,2000);
    this.loadTileMapBackgroundLayer(ga.layerBottom,"environment",1,2000);

    // Now load "collisionLayer" that you created in the tilemap
    // This set the rendering layer of the tilemap and turn on collisions for the tiles placed in the layer
    this.loadTileMapCollisionLayer(ga.layerBottom,"collisionLayer");

    var worldMap = this.tileMapBackgroundLayer["map"];
    ga.phaserGame["world"]["setBounds"](0, 0, worldMap["width"] * worldMap["tileWidth"], worldMap["height"] * worldMap["tileHeight"]);

};

PStatePlay.prototype.createHudBar = function(frameKey, barKey,barX, barY, maxNumber, initialValue) {
    var ga = this.dcGame;
    // x, y, frameWidth, frameHeight, initialNumber, minNumber, maxNumber, frameKey, barKey, layer, barXoffset, barYoffset, barWidth, barHeight
    return new Genari.CounterBar(
        barX, barY,
        null, 32,
        initialValue,
        0, maxNumber,
        frameKey, barKey,
        ga.layerButtons,
        8, 7, 82, 18
    );
};

PStatePlay.prototype.createHud = function (){
    var ga = this.dcGame;

    ga.hud = Genari.add.hud(ga.layerButtons);

    //ga.hud.addTopBar(0, 0, 'hud', null, 70); // 4x16 = 80

    //Create the pause button so that player can pause the game.
    ga.hud.addPauseButton(ga.BUTTON_EDGE_MARGIN+1, ga.BUTTON_EDGE_MARGIN+1, ga.pauseButtonSpriteKey, 44, ga.pause.bind(ga), ga);

    ga.hud.addUserPhoto(
        ga.gc_game_width - 160, ga.BUTTON_EDGE_MARGIN+3,
        ga.userPhotoKey, ga.userPhotoFrameKey, 39
    );

    //Create the elements of the status bar on the top.
    //                                key, size, endX, y, layer
    ga.scoreBox = Genari.add.scoreBox(ga.scoreReelSpriteKey, 30, ga.gc_game_width - 45, 18, ga.layerButtons);

    // Create Level text
    ga.hud.addLevelText(
        ga.gc_game_width, 10,
        'Level '+ (ga.currentGameLevel + 1),
        { "fontSize": '18px', "fill": "#000000" }
    );

    // Create Game objective text
    ga.hud.addGameObjectiveText(
        ga.gc_game_width, 31,
        Genari.getQuestion(),
        { "fontSize": '14px', "fill": "#000000" }
    );

    // key, x, y, playerSprite, scaleFactor
    this.miniMap = Genari.add.miniMap(
        ga.miniMapImageKey, 200, 320, this.player.playerSprite, 100/(this.backgroundWidth*2), null, ga.layerButtons
    );

    // Life icon
    ga.hud.addLifeIcon(ga.gc_life_icon_x-80, ga.BUTTON_EDGE_MARGIN+50, ga.lifeIconImgKey, 25);

    // Weapon icon
    ga.currentWeapon = ga.hud.addHudIcon(
        ga.gc_life_icon_x-80, ga.BUTTON_EDGE_MARGIN+90,
        ga.selectedWeapon || ga.pistolWeaponImgKey,
        25
    );

    // Create player health bar
    ga.healthBar = this.createHudBar(
        ga.healthFrameImgKey, ga.healthBarImgKey,
        ga.BUTTON_EDGE_MARGIN+30, ga.BUTTON_EDGE_MARGIN*5+5, ga.playerMaxHealth, ga.playerMaxHealth
    );

    // Create and set bullet bar
    ga.bulletBar = this.createHudBar(ga.powerFrameImgKey, ga.powerBarImgKey, ga.BUTTON_EDGE_MARGIN+30,
        ga.BUTTON_EDGE_MARGIN*9, ga.playerMaxPower, ga.playerMaxPower);
    var playerPower = null;
    if (ga.selectedWeapon === ga.pistolWeaponImgKey)
        playerPower = ga.weaponBulletCount;
    else if (ga.selectedWeapon === ga.laserGunWeaponImgKey)
        playerPower = ga.laserGunBulletCount;
    else if (ga.selectedWeapon === ga.machineGunWeaponImgKey)
        playerPower = ga.machineGunBulletCount;
    else if (ga.selectedWeapon === ga.sniperWeaponImgKey)
        playerPower = ga.sniperBulletCount;
    else if (ga.selectedWeapon === ga.cannonWeaponImgKey)
        playerPower = ga.cannonBulletCount;
    ga.bulletBar.setValue(playerPower);
};

PStatePlay.prototype.createLevelInvaders = function(){
    var ga = this.dcGame;
    // place coins
    ga.groupPickups.createObjects();
    // create monsters
    ga.groupMonster.createObjects(true);

};

PStatePlay.prototype.setPlayerLocation=function(){
    Genari.createTilemapObjects(Genari.dcGame.statePlay.tileMaps["worldTileMap"], this, 'player', this.spawnPlayer);
};

//Helper function to get player location in tilemap.
PStatePlay.prototype.spawnPlayer=function(refObjs){
    this.x=refObjs["x"];
    this.y=refObjs["y"];
};

/** @override */
PStatePlay.prototype.openingDialogAction = function() {
    var ga = this.dcGame;
    ga.removeGameDialogBox();
    ga.gameControl.showOnScreenButtons();

    this.player.resume();

    ga.audioPlay(ga.backgroundMusicKey);

    [ga.groupMonster].forEach(function(group) {
        if(group.getGroup()){
            group.getGroup()["children"].forEach(function(item) {
                item["body"]["velocity"]["y"] = -ga.enemyVelocity;
                item["body"]["bounce"]["setTo"](1, 1);
            });
        }
    });
};

// Load classes that extends classes defined in Genari.loadClasses
var myClassLoader = function() {   // DEVELOPER_CODE REMOVE_FOR_THEME

    /***********************************************************************************
     * The player object of the game.
     *
     * @param theGameObj The game object where the player object is placed to.
     * @param maxLife The maximum number of life that the player has throughout the game.
     * @param entryX The initial horizontal point of the player.
     * @param entryY The initial vertical point of the player.
     * @param jumpSoundKey The sound key used for jumping.
     * @constructor
     * @extends {Genari.RunPlayer}
     ***********************************************************************************/
    Genari.MazePlayer = function (theGameObj, maxLife, entryX, entryY, jumpSoundKey) {
        if (!(this instanceof Genari.MazePlayer)) return new Genari.MazePlayer(theGameObj, maxLife, entryX, entryY, jumpSoundKey);
        Genari.RunPlayer.call(this, theGameObj, maxLife, entryX, entryY);

        //this.remainingLife = maxLife;
        // create a player using an asset, which must be loaded already
        this.createPlayerAnimation(theGameObj.playerSpriteKey, -1, null,
            [12, 13, 14, 15], [4, 5, 6, 7], 4, true, [8, 9, 10, 11], [0, 1, 2, 3], false);

    };
    Genari.MazePlayer.prototype = Object.create(Genari.RunPlayer.prototype);
    Genari.MazePlayer.prototype.constructor = Genari.MazePlayer;


    Genari.MazePlayer.prototype.moveZone = function () {

        var px = this.playerSprite["x"] + this.playerSprite["width"];
        var py = this.playerSprite["y"] + this.playerSprite["height"];
        var cx = Genari.phaserGame["camera"]["x"];
        var cy = Genari.phaserGame["camera"]["y"];
        var gHeight = Genari.phaserGame["camera"]["height"];
        var gWidth = Genari.phaserGame["camera"]["width"];
        console.log(px, py, cx, cy, gHeight, gWidth);
        // check if in zone 1
        if (px < gWidth && py < gHeight) {
            // zone one
            Genari.phaserGame["camera"]["x"] = 0;
            Genari.phaserGame["camera"]["y"] = 0;
        } else if (px < gWidth && py > gHeight) {
            Genari.phaserGame["camera"]["x"] = 0;
            Genari.phaserGame["camera"]["y"] = gHeight;
            // zone two
        } else if (px > gWidth && py < gHeight) {
            // zone three
            Genari.phaserGame["camera"]["x"] = gWidth;
            Genari.phaserGame["camera"]["y"] = 0;

        } else if (px > gWidth && py > gHeight) {
            // zone four
            Genari.phaserGame["camera"]["x"] = gWidth;
            Genari.phaserGame["camera"]["y"] = gHeight;

        }
    };

    Genari.MazePlayer.prototype.update = function () {
        var ga = this.dcGame;
        var gac = this.dcGame.gameControl;

        //------------------------------------------------------------------
        // Check Player collide with tiles
        ga.phaserGame["physics"]["arcade"]["collide"](this.playerSprite, ga.statePlay.tileMapCollisionLayer);

        // Check Player hits the word boxes
        if (!this.isBlinking) {
            ga.groupMonster.checkOverlap(this.playerSprite, function () {
                var ga = this.dcGame;
                ga.audioPlay(ga.incorrectSndKey);
                ga.player.killPlayer();
            }.bind(this), null, this);
            ga.groupCorrectBox.checkOverlap(this.playerSprite, this.collectStar, null, this);
            ga.groupIncorrectBox.checkOverlap(this.playerSprite, this.hitWrong, null, this);
        }

        // check player hits pickup items
        ga.groupPickups.checkOverlap(this.playerSprite, this.collectCoin, null, this);

        //------------------------------------------------------------------
        // Control player
        var isWalking = false;

        // Allow 8 way walking
        var leftPressed = gac.stickLeftRight < 0 || gac.checkCursorKeyLeftDown();
        var rightPressed = gac.stickLeftRight > 0 || gac.checkCursorKeyRightDown();
        var upPressed = gac.stickUpDown > 0 || gac.checkCursorKeyUpDown();
        var downPressed = gac.stickUpDown < 0 || gac.checkCursorKeyDownDown();


        if (upPressed) {
            this.walkUp(leftPressed, rightPressed);
            isWalking = true;
        } else if (downPressed) {
            this.walkDown(leftPressed, rightPressed);
            isWalking = true;
        } else {
            // set y speed to 0
            this.playerSprite["body"]["velocity"]["y"] = 0;
        }

        if (leftPressed) {
            this.walkLeft();
            isWalking = true;
        } else if (rightPressed) {
            this.walkRight();
            isWalking = true;
        } else {
            // set x speed to 0
            this.playerSprite["body"]["velocity"]["x"] = 0;
        }

        if (!isWalking) {
            this.standStill();
        }
    };
    /**
     * The function triggered when the player overlaps with the wrong object.
     * @param object1 The overlapping object.
     * @param object2 The overlapped object.
     */
    Genari.MazePlayer.prototype.collectStar = function (object1, object2) {
        var ga = this.dcGame;

        var objs = ga.groupCorrectBox.getObjInGroup(object1, object2);
        var wordbox = objs[0]; // first object is the object in the group
        //var player = objs[1];

        //When player touches the right words, the word gets exploded and player gains 1 score.
        //ga.audioPlay(ga.correctSndKey);
        Genari.Effect.bubbleScore(wordbox);
        wordbox["destroy"]();
        ga.updateScore(1);
    };

    /**
     * The function trigerred when the player overlaps with the wrong object.
     */
    Genari.MazePlayer.prototype.hitWrong = function () {
        var ga = this.dcGame;
        //When player touches the wrong words, the player loses 1 life and continues (if there is life) or game over (if no more life).
        ga.audioPlay(ga.incorrectSndKey);
        ga.player.killPlayer();

    };

    /**
     * The function triggered when player collides with coin.
     * @param object1 The player object.
     * @param object2 The word box object.
     */
    Genari.MazePlayer.prototype.collectCoin = function (object1, object2) {
        var ga = this.dcGame;

        var objs = ga.groupPickups.getObjInGroup(object1, object2);
        var coin = objs[0];  // first object is the object in the group

        ga.audioPlay(ga.collectSndKey);
        Genari.Effect.bubbleScore(coin);
        coin["destroy"]();
        ga.updateScore(1);
    };

    /**
     * The function which ensures the player stay standing.
     * @override
     */
    Genari.MazePlayer.prototype.standStill = function () {
        this.playerSprite["body"]["velocity"]["x"] = 0;
        this.playerSprite["animations"]["stop"]();
    };

    /**
     * The function triggered when the down button is pressed or joystick moved downwards.
     * @param leftPressed Checks whether the left button is also pressed at the same time.
     * @param rightPressed Checks whether the right button is also pressed at the same time.
     * @param [speed] The target speed of the player.
     * @override
     */
    Genari.MazePlayer.prototype.walkDown = function (leftPressed, rightPressed, speed) {
        if (typeof speed == "undefined") speed = this.walkSpeed;
        this.playerSprite["body"]["velocity"]["y"] = speed;
        if (!(leftPressed || rightPressed)) this.playerSprite["animations"]["play"]('down');
    };

    /**
     * The function triggered when the down button is pressed or joystick moved downwards.
     * @param leftPressed Checks whether the left button is also pressed at the same time.
     * @param rightPressed Checks whether the right button is also pressed at the same time.
     * @param speed The target speed of the player.
     * @override
     */
    Genari.MazePlayer.prototype.walkUp = function (leftPressed, rightPressed, speed) {
        if (typeof speed == "undefined") speed = this.walkSpeed;
        this.playerSprite["body"]["velocity"]["y"] = -speed;
        if (!(leftPressed || rightPressed)) this.playerSprite["animations"]["play"]('up');
    };

    /**
     * Pause the game and all its animations
     * @override
     */
    Genari.MazePlayer.prototype.pause = function () {
        var ga = this.dcGame;
        this.controlSprite(false);
        ga.groupBoss.pauseDragon();
        ga.groupMonster.pauseMonster();
        ga.groupPlayerBullets.pause();
        ga.groupMonsterBullet.pause();
    };

    /**
     * Resume the game and all its animations
     * @override
     */
    Genari.MazePlayer.prototype.resume = function () {
        var ga = this.dcGame;
        this.controlSprite(true);
        ga.groupBoss.resumeDragon();
        ga.groupMonster.resumeMonster();
        ga.groupPlayerBullets.resume();
        ga.groupMonsterBullet.resume();
    };

    /**
     * Enable or disable the movement of all sprite.
     * @param enable The boolean which decides whether to enable or disable all movements.
     */
    Genari.MazePlayer.prototype.controlSprite = function (enable) {
        this.playerSprite["body"]["enable"] = enable;

        [Genari.dcGame.groupMonster].forEach(function (group) {
            if (group.getGroup()) {
                group.getGroup()["children"].forEach(function (item) {
                    if (item && item["body"]) item["body"]["enable"] = enable;
                });
            }
        }.bind(this));
    };


    //The restart function called during gameplay for purposes like player falls down.
    Genari.MazePlayer.prototype.killPlayer = function () {
        var ga = this.dcGame;
        //this.remainingLife -= 1;
        ga.healthBar.addValue(-1);

        //ga.hud.setLifeValue(this.remainingLife);

        if (ga.healthBar.getValue() == 0) {
            // ** DO NOT Pause Phaser game. It will stop playing gavme over audio
            ga.bulletAssetKey = ga.pistolBulletImgKey;
            ga.gameOver();

        }
        else
            this.blinkFor();
    };

    /************************************************************************************
     * Example of how to extend a class defined in loadClasses()
     *
     * Manage monsters in maze
     * @param {object} layer Phaser.Group. Rendering layer of this group.
     * @param {boolean} [fixedToCamera] If set to true, it move with camera. The location is then camera offsets.
     * @param {boolean} [enableBody] If set to true, any objects added will have physics enables
     * @param {number} [physicsBodyType] Default 0. Phaser.Physics.ARCADE, Phaser.Physics.P2, Phaser.Physics.NINJA
     * @constructor
     * @extends {Genari.NPCMonsterGroup}
     ***********************************************************************************/
    Genari.MonsterGroup = function (layer, fixedToCamera, enableBody, physicsBodyType) {
        if (!(this instanceof Genari.MonsterGroup)) return new Genari.MonsterGroup(layer, fixedToCamera, enableBody, physicsBodyType);  // make sure this refer to a DCGame
        Genari.NPCMonsterGroup.call(this, layer, fixedToCamera, enableBody, physicsBodyType);
    };
    Genari.MonsterGroup.prototype = Object.create(Genari.NPCMonsterGroup.prototype); // extend DCGroup
    Genari.MonsterGroup.prototype.constructor = Genari.MonsterGroup;       // set constructor property

    Genari.MonsterGroup.prototype.createObjects = function (isEnemy) {
        var ga = this.dcGame;
        var velocity = ga.enemyVelocity * (1 + ga.currentGameLevel / 10);
        this.setMonsterType(isEnemy);
        this.setDefaultVelocity(velocity);
        this.setDefaultFrameRate(4);
        //Genari.dcGame.groupMonster.turnOnDebug(); // turn on debug mode to show the route planning of monster

        Genari.createTilemapObjects(Genari.dcGame.statePlay.tileMaps["worldTileMap"], this, 'monsters', this.spawnMonsters);
    };

    Genari.MonsterGroup.prototype.spawnMonsters = function (refObj) {
        var ga = Genari.dcGame;
        var x = refObj["x"];
        var y = refObj["y"];

        var spriteType = [
            ga.easyDefeatMonsterSpriteKey,
            ga.mediocreDefeatMonsterSpriteKey,
            ga.mediumDefeatMonsterSpriteKey,
            ga.hardDefeatMonsterSpriteKey,
            ga.difficultDefeatMonsterSpriteKey
        ];

        var monsterNumber = Math.floor(Math.random() * spriteType.length);
        var spriteName = spriteType[monsterNumber];
        var monster = this.create(x, y, spriteName);
        monster.type = Math.floor((monsterNumber + 1) / 2) + 1;
        monster.health = 5 - ((monster.type / 2 < 1) ? Math.floor(monster.type / 2) : Math.round(monster.type / 2) * 2);
        monster.shoot = false;

        monster["animations"]["add"]('MoveRight', [3, 4]);
        monster["animations"]["add"]('MoveLeft', [1, 0]);
        monster["autoCull"] = true;
    };

    Genari.MonsterGroup.prototype.popEnemyFromChest = function (x, y) {
        var ga = this.dcGame;
        this.spawnMonsters({"x": x, "y": y});
        var velocity = ga.enemyVelocity * (1 + ga.currentGameLevel / 10);
        this.setMonsterType(true);
        this.setDefaultVelocity(velocity);
        this.setDefaultFrameRate(4);
        //Genari.dcGame.groupMonster.turnOnDebug(); // turn on debug mode to show the route planning of monster
    };

    Genari.MonsterGroup.prototype.update = function () {
        // monsters collide with tiles and bounce off
        var ga = this.dcGame;
        //this.checkCollision(ga.statePlay.tileMapCollisionLayer, this.collideWithTilemap, null, this);
        this.updateMonsterWalk(ga.player.playerSprite);
    };
    Genari.MonsterGroup.prototype.pauseMonster = function () {
        this.getGroup().forEach(function (monster) {
            monster["animations"]["paused"] = true;
        });
    };
    Genari.MonsterGroup.prototype.resumeMonster = function () {
        this.getGroup().forEach(function (monster) {
            monster["animations"]["paused"] = false;
        });
    };
    /**
     * The function triggered when object collides with tile.
     * @param object The colliding object.
     */
    Genari.MonsterGroup.prototype.collideWithTilemap = function (object) {

        var ga = this.dcGame;

        var velocity = ga.enemyVelocity;
        velocity *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

        if (object["body"]["velocity"]["x"] == 0) {
            object["body"]["velocity"]["x"] = velocity;
            object["body"]["velocity"]["y"] = 0;
        } else if (object["body"]["velocity"]["y"] == 0) {
            object["body"]["velocity"]["y"] = velocity;
            object["body"]["velocity"]["x"] = 0;
        }
    };

    Genari.MonsterGroup.prototype.distance = function (x1, y1, x2, y2) {
        var dx = x1 - x2;
        var dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    };

    /**
     * TODO: fix monster walk. Do not go back to the same direction. Try
     * Control the movements of the monsters in this group at each frame
     * @param playerSprite
     */
    Genari.MonsterGroup.prototype.updateMonsterWalk = function (playerSprite) {
        if (!this.getGroup()) return;

        var distanceToPlayer = 0;
        var ga = this.dcGame;
        var rx, ry;
        var wd = Genari.phaserGame["world"]["width"];
        var wh = Genari.phaserGame["world"]["height"];

        // Iterate through each monster in this group
        this.getGroup().forEach(function (monster) {

            if (monster["animations"]["paused"] == false) {

                // Set monster animation
                var animationKey = "";
                if (monster["body"]["velocity"]["x"] < 0)
                    animationKey = 'MoveLeft';
                else if (monster["body"]["velocity"]["x"] > 0)
                    animationKey = 'MoveRight';
                monster["animations"]["play"](animationKey, 2, true);

                distanceToPlayer = this.distance(
                    playerSprite["x"] + (playerSprite["width"] / 2), playerSprite["y"] + (playerSprite["height"] / 2),
                    monster["x"] + (monster["width"] / 2), monster["y"] + (monster["height"] / 2)
                );

                // Shoot if player is nearby every 3 seconds
                var shootPeriod = 3;
                if (distanceToPlayer < 350) {
                    // Shoot
                    if (parseInt(ga.phaserGame["time"]["totalElapsedSeconds"]()) % shootPeriod === 0 && !monster["shoot"]) {
                        if (playerSprite["body"]["x"] < monster["body"]["x"] || playerSprite["body"]["x"] > monster["body"]["x"]) {
                            monster["shoot"] = true;
                            var speedX = monster["body"]["velocity"]["x"];
                            if (ga.statePlay.player["x"]<monster["x"])
                            {
                                speedX = -(Math.abs(speedX) * 4);
                            }
                            if (ga.statePlay.player["x"]>monster["x"]){
                                speedX = Math.abs(speedX) * 4;
                            }

                            var speedY = monster["body"]["velocity"]["y"];
                            if (ga.statePlay["y"]<monster["y"]){
                                speedY = Math.abs(speedY) * 4;
                            }
                            else if (ga.statePlay["y"]>monster["y"]){
                                speedY = -(Math.abs(speedY) * 4);
                            }
                            var attackX = ((playerSprite["body"]["x"] < monster["body"]["x"]) ? -1 : 1) * monster["body"]["x"];
                            var attackY = ((playerSprite["body"]["y"] < monster["body"]["y"]) ? -1 : 1) * (monster["body"]["y"] + 30);
                            var chance = Math.floor(Math.random() * 2);
                            ga.groupMonsterBullet.createBullet(
                                attackX, attackY, ga.enemyAttackSpriteKey, speedX, speedY, ga.groupMonsterBullet.bulletTravelDistance
                            );
                            ga.groupMonsterBullet.createBullet(
                                attackX, attackY, ga.enemyAttackSpriteKey, speedX, (chance === 1) ? -90 : 90, ga.groupMonsterBullet.bulletTravelDistance
                            );
                        }
                    }
                }

                // kill bullets every 3 seconds
                if (parseInt(ga.phaserGame["time"]["totalElapsedSeconds"]()) % shootPeriod === 0) {
                    if (ga.groupMonsterBullet.getGroup() > 0) {
                        ga.groupMonsterBullet.getGroup().forEach(function (bullet) {
                            bullet["kill"]();
                        });
                    }
                }

                if (parseInt(ga.phaserGame["time"]["totalElapsedSeconds"]()) % shootPeriod > 0 && monster["shoot"]) {
                    monster["shoot"] = false;
                }

                // if at the center box of the maze, try to get out of there!

                //if (monster["x"] > wd / 2 - 100 && monster["x"] < wd / 2 + 100 &&
                //    monster["y"] > wh / 2 && monster["y"] < wh / 2 + 200) {
                //    rx = wd / 2 + Math.random() * 100 - 50;  // scatter monsters
                //    ry = 0; // move to top
                //    this.quickRoute(monster, playerSprite, 3.5, rx, ry); // create routes and let them follow the route
                //} else {
                // Set the movement of the monster based on the distance to the player
                if (distanceToPlayer <= 200)
                    this.quickRoute(monster, playerSprite, 5);
                else {
                    // just wonder around to someplace nice. or do you wan them to wonder near the player?
                    rx = Math.random() * wd;
                    ry = Math.random() * wh;
                    this.quickRoute(monster, playerSprite, 5, rx, ry);
                }
                //}
            }
        }.bind(this));
    };

    /************************************************************************************
     * Example of how to extend a class defined in loadClasses()
     *
     * Manage monsters in maze
     * @param {object} layer Phaser.Group. Rendering layer of this group.
     * @param {boolean} [fixedToCamera] If set to true, it move with camera. The location is then camera offsets.
     * @param {boolean} [enableBody] If set to true, any objects added will have physics enables
     * @param {number} [physicsBodyType] Default 0. Phaser.Physics.ARCADE, Phaser.Physics.P2, Phaser.Physics.NINJA
     * @constructor
     * @extends {Genari.PickupGroup}
     ***********************************************************************************/
    Genari.CoinsGroup = function (layer, fixedToCamera, enableBody, physicsBodyType) {
        if (!(this instanceof Genari.CoinsGroup)) return new Genari.CoinsGroup(layer, fixedToCamera, enableBody, physicsBodyType);  // make sure this refer to a DCGame
        Genari.PickupGroup.call(this, layer, fixedToCamera, enableBody, physicsBodyType);
    };
    Genari.CoinsGroup.prototype = Object.create(Genari.PickupGroup.prototype); // extend DCGroup
    Genari.CoinsGroup.prototype.constructor = Genari.CoinsGroup;       // set constructor property

    Genari.CoinsGroup.prototype.createObjects = function () {
        var ga = this.dcGame;

        // Prepare the grid before placing pickup items
        var grid = ga.groupPickups.setupGrid(ga.statePlay.tileMapCollisionLayer, 16, 16, 1, 1, 5, 0);

        // Also set the grid for monsters for smart routing
        ga.groupMonster.setGrid(ga.statePlay.tileMapCollisionLayer, 16, 16, grid);
        ga.groupMonster.turnOnDebug(); // DEVELOPER_CODE REMOVE_FOR_THEME
    };

    Genari.CoinsGroup.prototype.update = function () {

    };
    Genari.CoinsGroup.prototype.pause = function () {
        this.getGroup().forEach(function (coins) {
            coins["animations"]["paused"] = true;
        });
    };
    Genari.CoinsGroup.prototype.resume = function () {
        this.getGroup().forEach(function (coins) {
            coins["animations"]["paused"] = false;
        });
    };
    /************************************************************************************
     * Word boxes
     * @param {Phaser.Group} layer Rendering layer of this group.
     * @param {boolean} [fixedToCamera] If set to true, it move with camera. The location is then camera offsets.
     * @param {boolean} [enableBody] If set to true, any objects added will have physics enables
     * @param {number} [physicsBodyType] Default 0. Phaser.Physics.ARCADE, Phaser.Physics.P2, Phaser.Physics.NINJA
     * @constructor
     * @extends {Genari.WordBoxGroup}
     ***********************************************************************************/
    Genari.TreasureGroup = function (layer, fixedToCamera, enableBody, physicsBodyType) {
        if (!(this instanceof Genari.TreasureGroup)) return new Genari.TreasureGroup(layer, fixedToCamera, enableBody, physicsBodyType);  // make sure this refer to a DCGame
        Genari.WordBoxGroup.call(this, layer, fixedToCamera, enableBody, physicsBodyType);
    };
    Genari.TreasureGroup.prototype = Object.create(Genari.WordBoxGroup.prototype); // extend DCGroup
    Genari.TreasureGroup.prototype.constructor = Genari.TreasureGroup;        // set constructor property

    Genari.TreasureGroup.prototype.update = function () {
        // Check player hits word boxes or pickups
        this.dcGame.phaserGame["physics"]["arcade"]["overlap"](
            this.dcGame.player.playerSprite,
            this.getGroup(),
            this.hitTreasure, null, this
        );
    };

    Genari.TreasureGroup.prototype.hitTreasure = function (player, treasure) {
        if (treasure.score >= 0)
            this.collectStar(player, treasure);
        else
            this.hitWrong(player, treasure);
    };

    Genari.TreasureGroup.prototype.collectStar = function (player, treasure) {
        var ga = this.dcGame;
        //When player touches the right words, the word gets exploded and player gains 1 score.
        //ga.audioPlay(ga.correctSndKey);
        treasure["children"][0]["animations"]["play"]('Vanish', 20, false);
        treasure["body"]["enable"] = false;
        ga.phaserGame["time"]["events"]["add"](100, treasure["destroy"], treasure);

        Genari.Effect.bubbleScore(treasure, 1);
        ga.updateScore(1);
    };

    Genari.TreasureGroup.prototype.hitWrong = function (player, treasure) {
        var ga = this.dcGame;

        //When player touches the wrong words, the player loses 1 life and continues (if there is life) or game over (if no more life).
        ga.audioPlay(ga.incorrectSndKey);
        treasure["children"][0]["animations"]["play"]('Vanish', 20, false);
        treasure["body"]["enable"] = false;
        var x = treasure["body"]["x"] + 50;
        var y = treasure["body"]["y"];

        ga.groupMonster.popEnemyFromChest(x, y);
        ga.phaserGame["time"]["events"]["add"](100, treasure["destroy"], treasure);
    };

    /**
     * Create treasure boxes with text on top of it as pickup items.
     */
    Genari.TreasureGroup.prototype.createTreasureBoxes = function () {
        // Reference objects to create objects
        Genari.createTilemapObjects(Genari.dcGame.statePlay.tileMaps["worldTileMap"], this, Genari.dcGame.treasureBoxLayerKey, this.createWordBox);
    };

    /**
     * Create a treasure box with text on top of it as a pickup item using the provided item as the reference location.
     * @param item Used as the reference location
     */
    Genari.TreasureGroup.prototype.createWordBox = function (item) {
        var x = item["x"];
        var y = item["y"];
        var statement = Genari.getRandomStatement();
        var treasure = this.addSpriteTextBox(x, y, statement, statement["score"], Genari.dcGame.treasureBoxImgKey, 0);
        var text = treasure["children"][0];
        text["x"] = (treasure["width"] / 2) - (text["width"] / 2);
        text["y"] = -text["height"];
        treasure["autoCull"] = true;
    };
    /************************************************************************************
     * Word boxes
     * @param {Phaser.Group} layer Rendering layer of this group.
     * @param {boolean} [fixedToCamera] If set to true, it move with camera. The location is then camera offsets.
     * @param {boolean} [enableBody] If set to true, any objects added will have physics enables
     * @param {number} [physicsBodyType] Default 0. Phaser.Physics.ARCADE, Phaser.Physics.P2, Phaser.Physics.NINJA
     * @constructor
     * @extends {Genari.WordBoxGroup}
     ***********************************************************************************/
    Genari.CrateGroup = function (layer, fixedToCamera, enableBody, physicsBodyType) {
        if (!(this instanceof Genari.CrateGroup)) return new Genari.CrateGroup(layer, fixedToCamera, enableBody, physicsBodyType);  // make sure this refer to a DCGame
        Genari.WordBoxGroup.call(this, layer, fixedToCamera, enableBody, physicsBodyType);
    };
    Genari.CrateGroup.prototype = Object.create(Genari.WordBoxGroup.prototype); // extend DCGroup
    Genari.CrateGroup.prototype.constructor = Genari.CrateGroup;        // set constructor property

    Genari.CrateGroup.prototype.update = function () {
        // Check player hits word boxes or pickups
        this.dcGame.phaserGame["physics"]["arcade"]["overlap"](
            this.dcGame.player.playerSprite,
            this.getGroup(),
            this.hitCrate, null, this
        );
    };

    Genari.CrateGroup.prototype.hitCrate = function (player, crate) {
        //if (crate.score >= 0)
        this.collectStar(player, crate);
        //else
        //    this.hitWrong(player, crate);
    };

    Genari.CrateGroup.prototype.collectStar = function (player, crate) {
        var ga = this.dcGame;
        //When player touches the right words, the word gets exploded and player gains 1 score.
        //ga.audioPlay(ga.correctSndKey);

        // crate["children"][0]["animations"]["play"]('Vanish', 20, false);
        crate["body"]["enable"] = false;
        ga.phaserGame["time"]["events"]["add"](100, crate["destroy"], crate);
        //ga.lifeText.addValue(1);
        if (crate["key"] === ga.supplyBoxSpriteKey || crate["key"] === ga.supplyCaseSpriteKey) {
            var reward = Math.random() * 10;
            if (reward < 4) {
                Genari.Effect.bubbleScore(crate, "1 Point");
                ga.updateScore(1);
            } else if (reward > 7) {
                ga.bulletBar.addValue(2);
                if (ga.laserGun) ga.laserGunBulletCount += 2;
                else if (ga.machineGun) ga.machineGunBulletCount += 2;
                else if (ga.sniper) ga.sniperBulletCount += 2;
                else if (ga.cannon) ga.cannonBulletCount += 2;
                Genari.Effect.bubbleScore(crate, "2 Bullets");
            } else {
                ga.healthBar.addValue(1);
                Genari.Effect.bubbleScore(crate, "1 health");
            }
        } else if (crate["key"] === ga.ammoSpriteKey) {
            ga.bulletBar.addValue(5);

            if (ga.laserGun) ga.laserGunBulletCount += 5;
            else if (ga.machineGun) ga.machineGunBulletCount += 5;
            else if (ga.sniper) ga.sniperBulletCount += 5;
            else if (ga.cannon) ga.cannonBulletCount += 5;

            Genari.Effect.bubbleScore(crate, "5 bullets");
        } else if (crate["key"] == ga.medicineSpriteKey) {
            ga.healthBar.addValue(1);
            Genari.Effect.bubbleScore(crate, "1 health");
        }
    };

    Genari.CrateGroup.prototype.hitWrong = function (player, crate) {
        var ga = this.dcGame;

        //When player touches the wrong words, the player loses 1 life and continues (if there is life) or game over (if no more life).
        ga.audioPlay(ga.collectSndKey);
        crate["children"][0]["animations"]["play"]('Vanish', 20, false);
        crate["body"]["enable"] = false;
        var x = crate["body"]["x"] + 50;
        var y = crate["body"]["y"];

        ga.groupMonster.popEnemyFromChest(x, y);
        ga.phaserGame["time"]["events"]["add"](100, crate["destroy"], crate);
    };

    /**
     * Create treasure boxes with text on top of it as pickup items.
     */
    Genari.CrateGroup.prototype.createCrates = function () {
        Genari.createTilemapObjects(Genari.dcGame.statePlay.tileMaps["worldTileMap"], this, 'supplies', this.createSupplies);
    };

    /**
     * Create a treasure box with text on top of it as a pickup item using the provided item as the reference location.
     * @param item Used as the reference location
     */
    Genari.CrateGroup.prototype.createSupplies = function (item) {
        var ga = this.dcGame;
        //if (item["x"] == 0) {
        var x = item["x"];
        var y = item["y"];
        var statement = Genari.getRandomStatement();
        var word = statement["word"];
        var score = statement["score"];
        var spriteType = [ga.supplyBoxSpriteKey, ga.supplyCaseSpriteKey, ga.ammoSpriteKey, ga.medicineSpriteKey];

        //var treasureType = Math.random()*10;
        var spriteName = spriteType[Math.floor(Math.random() * spriteType.length)];
        var crate = this.addSprite(x, y, spriteName, 0);
        //crate["autoCull"] = true;
        //}
    };

    /************************************************************************************
     * Player bullets
     * @param {Phaser.Group} layer Rendering layer of this group.
     * @param {boolean} [fixedToCamera] If set to true, it move with camera. The location is then camera offsets.
     * @param {boolean} [enableBody] If set to true, any objects added will have physics enables
     * @param {number} [physicsBodyType] Default 0. Phaser.Physics.ARCADE, Phaser.Physics.P2, Phaser.Physics.NINJA
     * @constructor
     * @extends {Genari.NPCMonsterGroup}
     ***********************************************************************************/
    Genari.PlayerBulletGroup = function (layer, fixedToCamera, enableBody, physicsBodyType) {
        if (!(this instanceof Genari.PlayerBulletGroup)) return new Genari.PlayerBulletGroup(layer, fixedToCamera, enableBody, physicsBodyType);  // make sure this refer to a DCGame
        Genari.BulletGroup.call(this, layer, fixedToCamera, enableBody, physicsBodyType);

        this.bulletCount = 0;
        this.bulletTravelDistance = Genari.dcGame.gc_game_width / 2;
        this.shoot = true;

    };
    Genari.PlayerBulletGroup.prototype = Object.create(Genari.BulletGroup.prototype); // extend DCGroup
    Genari.PlayerBulletGroup.prototype.constructor = Genari.PlayerBulletGroup;        // set constructor property

    Genari.PlayerBulletGroup.prototype.update = function () {
        var ga = this.dcGame;

        this.updateBullets();

        // Check if bullets hit the platform
        ga.phaserGame["physics"]["arcade"]["collide"](
            this.getGroup(),
            ga.statePlay.tileMapCollisionLayer,
            this.hitWall, null, this
        );

        ga.phaserGame["physics"]["arcade"]["overlap"](
            this.getGroup(),
            ga.groupMonster.getGroup(),
            this.hitMonster, null, this);
        if (ga.bulletBar.getValue() == 0) {
            this.shoot = false;
        }

    };
    /**
     * Destroy display objects
     * @override
     */
    Genari.PlayerBulletGroup.prototype.currentWeapon = function () {
        var ga = this.dcGame;
        if (ga.currentWeapon) ga.currentWeapon["destroy"]();
        ga.currentWeapon = ga.hud.addHudIcon(ga.gc_life_icon_x - 80, ga.BUTTON_EDGE_MARGIN + 90,
            ga.selectedWeapon || ga.pistolWeaponImgKey, 18);
        ga.gameControl.setWeaponSelector(ga.selectedWeapon || ga.pistolWeaponImgKey);
    };

    Genari.PlayerBulletGroup.prototype.hitMonster = function (bullet, monster) {
        var ga = Genari.dcGame;
        var map = new Genari.MiniMap();
        ga.audioPlay(ga.explosionSndKey);
        Genari.Effect.explosion(monster, false, ga.explosionSmall);
        bullet["kill"]();

        if (bullet["key"] === ga.pistolBulletImgKey) monster.health -= 1;
        else if (bullet["key"] === ga.laserGunBulletImgKey) monster.health -= 2;
        else if (bullet["key"] === ga.machineGunBulletImgKey || bullet["key"] === ga.sniperBulletImgKey) monster.health -= 3;
        else if (bullet["key"] === ga.cannonBulletImgKey) monster.health -= 5;

        if (monster.health < 1) {
            map.removeDot(monster);
            Genari.Effect.bubbleScore(monster, '1');
            Genari.Effect.explosion(monster, true, ga.explosionBig);
            ga.updateScore(1);
        } else Genari.Effect.explosion(monster, false, ga.explosionSmall);
    };

    Genari.PlayerBulletGroup.prototype.hitWall = function (bullet) {
        bullet["kill"]();
    };
    Genari.PlayerBulletGroup.prototype.pause = function () {
        this.getGroup().forEach(function (bullet) {

            bullet["body"]["enable"] = false;
        });
    };
    Genari.PlayerBulletGroup.prototype.resume = function () {
        this.getGroup().forEach(function (bullet) {
            bullet["body"]["enable"] = true;
        });
    };
    Genari.PlayerBulletGroup.prototype.changeBullet = function (weapon, bullet, bulletCount) {
        var ga = this.dcGame;
        var bulletKey = '';
        this.shoot = (weapon == true);
        ga.bulletAssetKey = bullet;
        ga.bulletBar.setValue((weapon == true) ? bulletCount : 0);
        if (bullet === ga.pistolBulletImgKey) bulletKey = ga.pistolWeaponImgKey;
        else if (bullet === ga.laserGunBulletImgKey) bulletKey = ga.laserGunWeaponImgKey;
        else if (bullet === ga.machineGunBulletImgKey) bulletKey = ga.machineGunWeaponImgKey;
        else if (bullet === ga.sniperBulletImgKey) bulletKey = ga.sniperWeaponImgKey;
        else if (bullet === ga.cannonBulletImgKey) bulletKey = ga.cannonWeaponImgKey;
        if (ga.currentWeapon) ga.currentWeapon["destroy"](); // Destroy the weapon element and replace with new one.
        ga.currentWeapon = ga.hud.addHudIcon(ga.gc_life_icon_x - 80, ga.BUTTON_EDGE_MARGIN + 90, bulletKey, 25);
        ga.gameControl.setWeaponSelector(bulletKey);

    };

    Genari.PlayerBulletGroup.prototype.checkBullets = function () {
        var ga = this.dcGame;
        if (this.shoot) {
            this.shootBullets();
            if (ga.bulletAssetKey === ga.laserGunBulletImgKey) {
                ga.laserGunBulletCount -= 1;
                if (ga.laserGunBulletCount < 1) ga.laserGunBulletCount = 0;
            } else if (ga.bulletAssetKey === ga.machineGunBulletImgKey) {
                ga.machineGunBulletCount -= 1;
                if (ga.machineGunBulletCount < 1) ga.machineGunBulletCount = 0;
            } else if (ga.bulletAssetKey === ga.sniperBulletImgKey) {
                ga.sniperBulletCount -= 1;
                if (ga.sniperBulletCount < 1) ga.sniperBulletCount = 0;
            } else if (ga.bulletAssetKey === ga.cannonBulletImgKey) {
                ga.cannonBulletCount -= 1;
                if (ga.cannonBulletCount < 1) ga.cannonBulletCount = 0;
            }
        }
    };


    Genari.PlayerBulletGroup.prototype.shootBullets = function () {
        var ga = this.dcGame;
        var frame = ga.player.playerSprite["frame"];
        var jtstate = Genari.updateJoyStick();
        var stickLeftRight = jtstate[0];  // + if right, - if left
        var stickUpDown = jtstate[1];     // + if up, - if down

        var angle = 0;
        var leftPressed = stickLeftRight < 0 || this.checkCursorKeyLeftDown();
        var rightPressed = stickLeftRight > 0 || this.checkCursorKeyRightDown();
        var upPressed = stickUpDown > 0 || this.checkCursorKeyUpDown();
        var downPressed = stickUpDown < 0 || this.checkCursorKeyDownDown();

        if (leftPressed && upPressed) angle = 225;
        else if (leftPressed && downPressed) angle = 135;
        else if (rightPressed && upPressed) angle = 315;
        else if (rightPressed && downPressed) angle = 45;
        else {
            if (leftPressed || Math.floor(frame / 4) == 3) angle = 180;
            else if (rightPressed || Math.floor(frame / 4) == 1) angle = 0;
            else if (upPressed || Math.floor(frame / 4) == 2) angle = 270;
            else if (downPressed || Math.floor(frame / 4) == 0) angle = 90;
        }


        if (this.bulletCount < 1) {
            // shoot only once when key is down, wait until key is up
            this.createBullet(
                ga.player.getX(), ga.player.getMidY(),
                ga.bulletAssetKey, this.bulletTravelDistance, angle
            );
        }
    };

    Genari.PlayerBulletGroup.prototype.createBullet = function (x, y, key, speed, dirAngle) {
        var ga = this.dcGame;
        var gaShootSoundKey = ga.bulletAssetKey.split("B")[0] + "ShootSnd";
        ga.audioPlay(gaShootSoundKey);

        // Creates a new Phaser.Sprite object and adds it to the top of this group.
        //var bullet = this.dcGame.phaserGroups[this.bulletSpriteKey]["create"](x, y, this.bulletSpriteKey);
        // x, y, key, xSpeed, ySpeed, maxDistance, angle, animate, frames, frameRate, loop

        Genari.BulletGroup.prototype.addBulletWithAngle.call(this,
            x, y, key, speed, dirAngle,
            ga.phaserGame["camera"]["width"] / 3);
        this.bulletCount += 1;
    };
    Genari.PlayerBulletGroup.prototype.checkCursorKeyLeftDown = function () {
        return this.dcGame.cursorKeys["left"]["isDown"];
    };
    Genari.PlayerBulletGroup.prototype.checkCursorKeyRightDown = function () {
        return this.dcGame.cursorKeys["right"]["isDown"];
    };

    Genari.PlayerBulletGroup.prototype.checkCursorKeyUpDown = function () {
        return this.dcGame.cursorKeys["up"]["isDown"];
    };

    Genari.PlayerBulletGroup.prototype.checkCursorKeyDownDown = function () {
        return this.dcGame.cursorKeys["down"]["isDown"];
    };

    /************************************************************************************
     * TODO: create DCBoss class
     *
     * Manage a boss in the game.
     * A boss should spawn only when the player is near the boss!
     *
     * A boss has
     *      HP
     *      special high damage attacks that fire towards to the player. player need to avoid by moving around
     *      normal attacks that fire toward the player.
     *      moves. Do a regular and special moves time to time
     *      If killed, level complete.
     * We place the boss body, special attacks in this group.
     *
     * @param {Phaser.Group} layer Rendering layer of this group.
     * @param {boolean} [fixedToCamera] If set to true, it move with camera. The location is then camera offsets.
     * @param {boolean} [enableBody] If set to true, any objects added will have physics enables
     * @param {number} [physicsBodyType] Default 0. Phaser.Physics.ARCADE, Phaser.Physics.P2, Phaser.Physics.NINJA
     * @constructor
     * @extends {Genari.NPCMonsterGroup}
     ***********************************************************************************/
    Genari.BossGroup = function (layer, fixedToCamera, enableBody, physicsBodyType) {
        if (!(this instanceof Genari.BossGroup)) return new Genari.BossGroup(layer, fixedToCamera, enableBody, physicsBodyType);  // make sure this refer to a DCGame
        Genari.NPCMonsterGroup.call(this, layer, fixedToCamera, enableBody, physicsBodyType);

        // Hit point of the boss
        this.maxHp = 20;
        this.maxHealthBarFrame = 12; // total 13 frames starting from 0.
        this.shoot = false;
    };
    Genari.BossGroup.prototype = Object.create(Genari.NPCMonsterGroup.prototype); // extend DCGroup
    Genari.BossGroup.prototype.constructor = Genari.BossGroup;       // set constructor property

    /**
     * Spawn the dragon!
     */
    Genari.BossGroup.prototype.createDragon = function () {
        var ga = this.dcGame;

        this.attacking = false;
        this.dragonReady = false;
        this.fire = false;
        this.createFromObjects(ga.statePlay.tileMaps["worldTileMap"], 'boss', 'boss', ga.bossSpriteKey, 0, true, false);
        this.dragon = ga.groupBoss.getGroup()["children"][0];
        this.dragon["visible"] = false;

        if (this.dragon["inCamera"]) {
            this.dragon["visible"] = true;
            this.dragon["body"]["x"] = 500;
            this.dragonY = this.dragon["body"]["y"];

            this.dragon["animations"]["add"]('Rest', [0, 1, 2]);
            this.dragon["animations"]["add"]('Attack', [0, 1]);
            this.dragon["animations"]["play"]('Rest', 1, true);

            this.dragonHealthBar = Genari.phaserAddSprite(this.dragon["width"] / 2, 4, ga.dragonHealthBarSpriteKey);
            this.dragonHealthBar["scale"]["setTo"](0.3, 0.5);
            this.dragonHealthBar["x"] -= this.dragonHealthBar["width"] / 2; // <-- TODO : some sprite makes the bar look more leftward.
            this.dragon["addChild"](this.dragonHealthBar);
            this.dragon["body"]["velocity"]["y"] = 50;
            this.dragon["body"]["velocity"]["x"] = 70;
            this.dragon["body"]["collideWorldBounds"] = true;
            this.dragon["body"]["bounce"]["y"] = 1;
            this.dragon["body"]["bounce"]["x"] = 0;
            this.dragon.health = this.maxHp;
        }
    };

    /**
     * Update dragon moves.
     * Check if dragon hits the player and control its moves.
     * Call this in Play state update()
     */
    Genari.BossGroup.prototype.update = function () {
        if (!this.dragon) return;

        var ga = this.dcGame;
        this.checkCollision(ga.statePlay.tileMapCollisionLayer);

        //if (ga.player.playerSprite["body"]["x"] > ga.statePlay.backgroundWidth/3*2){
        if (this.dragonReady) {
            if (this.dragon["body"]["y"] > this.dragonY && this.dragon["body"]["velocity"]["y"] > 0) {
                this.dragonReady = false;
                this.dragon["body"]["velocity"]["y"] = 0;
                this.dragon["body"]["velocity"]["x"]=1;
                this.dragonAttack(1000);
            }
        } else {
            if (!this.attacking) {
                this.checkStatus();
            }
        }
        //}

        if (this.dragon["body"]["y"] < this.dragonY) this.dragonReady = true;

        if (this.dragon.health < 1) this.dcGame.groupSpaceship.createSpaceship();

        if (!ga.player.isBlinking) {
            ga.phaserGame["physics"]["arcade"]["overlap"](
                ga.player.playerSprite, this.getGroup(),
                this.bossTouchPlayer, null, this);
        }

        // Check if player shoots the dragon
        ga.phaserGame["physics"]["arcade"]["overlap"](
            this.dragon,
            ga.groupPlayerBullets.getGroup(),
            this.bulletHitDragon, null, this
        );
    };

    /**
     *
     */
    Genari.BossGroup.prototype.bossTouchPlayer = function () {
        this.dcGame.audioPlay(this.dcGame.incorrectSndKey);
        this.dcGame.player.killPlayer();
    };

    /**
     * Control dragon attacks. We should make the boss more smart. It is a dummy boss now.
     * @param time Delay in ms between attacks.
     */
    Genari.BossGroup.prototype.dragonAttack = function (time) {
        if (!this.dragon) return;

        var ga = this.dcGame;
        this.attacking = true;

        // TODO: why 1000?
        if (time === 1000) {
            this.dragon["animations"]["stop"]();
            this.dragon["animations"]["play"]('Attack', 3, false);
        }

        // TODO: some bosses not doing special attackes why?
        if (!this.fire) {
            var attackType = Math.floor(Math.random() * 3);
            this.dragonFireStart = ga.phaserGame["time"]["events"]["add"](time,
                function () {
                    //this.startFire(
                    //    'bossattack' + ((attackType > 0) ? attackType : ''),
                    //    3);
                    ga.audioPlay(ga.bossFireBreathSndKey);
                    // TODO: asset key usage should be independent of themes
                    //var condition = (!endLevel) ? (ga.currentGameLevel == startLevel) :
                    //    (ga.currentGameLevel == startLevel || ga.currentGameLevel == endLevel);
                    var attackSprite = ga.bossAttackImageKey; //(condition) ? 'bossattackS' : 'bossattack';
                    var attackKey = 'bossattack' + ((attackType > 0) ? attackType : '');
                    this.createFromObjects(ga.statePlay.tileMaps["worldTileMap"], 'boss', attackKey, attackSprite, 0, true, false);
                    this.fire = true;
                    this.dragonFire = this.getChild(1);
                    this.dragonFire["animations"]["add"]('Attack', [0]);
                    this.dragonFire["animations"]["play"]('Attack', 1, false);
                }, this);
            this.dragonFireEnd = ga.phaserGame["time"]["events"]["add"](time + 1500, this.stopAttack, this);
        }
        else this.dragonFireEnd = ga.phaserGame["time"]["events"]["add"](time, this.stopAttack, this);
    };

    /**
     * Function which starts the fire of the boss.
     * @param {string} attackKey The sprite key used to represent the boss's bullets
     * @param {number} startLevel Level to be checked
     * @param {number} endLevel Another level to be checked
     */
    /*
     Genari.BossGroup.prototype.startFire = function (attackKey, startLevel, endLevel) {
     var ga = Genari.dcGame;
     ga.audioPlay(ga.fireBreathSndKey);
     //var condition = (!endLevel) ? (ga.currentGameLevel == startLevel) :
     //    (ga.currentGameLevel == startLevel || ga.currentGameLevel == endLevel);
     var attackSprite = 'bossattack'; //(condition) ? 'bossattackS' : 'bossattack';
     this.createFromObjects(ga.statePlay.tileMaps["worldTileMap"], 'boss', attackKey, attackSprite, 0, true, false);
     this.fire = true;
     this.dragonFire = this.getChild(1);
     this.dragonFire["animations"]["add"]('Attack', [0]);
     this.dragonFire["animations"]["play"]('Attack', 1, false);
     };*/

    /**
     * Function which stops the boss fire.
     */
    Genari.BossGroup.prototype.stopAttack = function () {
        this.dragon["animations"]["stop"]();
        this.dragon["animations"]["play"]('Rest', 1, true);
        //ga.phaserGroups["boss"]["children"][1]["destroy"]();
        this.dragonFire["destroy"]();
        this.dragonFire["kill"]();
        this.fire = false;
        this.attacking = false;
        this.dragon["body"]["velocity"]["y"] = 50;
    };

    /**
     * Record damages to to the boss
     * @param damage
     */
    Genari.BossGroup.prototype.damageDragon = function (damage) {
        if (!this.dragon) return;

        var ga = this.dcGame;
        damage = Math.floor(damage / 2);
        if (damage <= 0) damage = 1;
        this.dragon.health -= damage;
        Genari.Effect.explosion(this.dragon, false, ga.explosionSmall);

        // Update health bar. This dragon uses a sprite with 13 frames. Frame 0 is full health state, Frame 12 is 0 health state
        if (this.dragon.health >= 0) {
            this.dragon["children"][0]["frame"] =
                this.maxHealthBarFrame - Math.floor((this.dragon.health / this.maxHp) * this.maxHealthBarFrame);
            Genari.Effect.explosion(this.dragon, false, ga.explosionSmall);
        }

        // Check if dragon died
        if (this.dragon.health < 1) {
            this.dragon["animations"]["stop"]();

            if (this.dragonFireStart) ga.phaserGame["time"]["events"]["remove"](this.dragonFireStart);
            if (this.dragonFireEnd) ga.phaserGame["time"]["events"]["remove"](this.dragonFireEnd);
            if (this.dragonFire) this.dragonFire["kill"]();

            this.dragon["kill"]();
            ga.updateScore(1);
        }
    };

    Genari.BossGroup.prototype.distance = function (x1, y1, x2, y2) {
        var dx = x1 - x2;
        var dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    };

    Genari.BossGroup.prototype.checkStatus = function () {
        var ga = this.dcGame;
        var x = 3;
        var distanceToPlayer = this.distance(
            ga.player.playerSprite["body"]["x"] + (ga.player.playerSprite["width"] / 2), ga.player.playerSprite["body"]["y"] + (ga.player.playerSprite["height"] / 2),
            this.dragon["body"]["x"] + (this.dragon["width"] / 2), this.dragon["body"]["y"] + (this.dragon["height"] / 2)
        );
        if (this.dragon.health > 1) {
            if (this.dragon["body"]["velocity"]["y"] !== 0) {
                if (distanceToPlayer < 500) {
                    if (parseInt(ga.phaserGame["time"]["totalElapsedSeconds"]()) % x === 0 && !this.shoot) {
                        this.shoot = true;
                        ga.groupMonsterBullet.spawnBossBullet();
                    } else if (parseInt(ga.phaserGame["time"]["totalElapsedSeconds"]()) % x !== 0 && this.shoot) {
                        this.shoot = false;
                    }
                }
            }
        }
    };

    /**
     * Called to handle event: player shoot the dragon with bullets.
     * @param dragon
     * @param bullet
     */
    Genari.BossGroup.prototype.bulletHitDragon = function (dragon, bullet) {
        if (!this.dragon) return;

        var ga = this.dcGame;
        ga.audioPlay(ga.explosionSndKey);

        if (bullet["key"] === ga.pistolBulletImgKey) this.damageDragon(1);
        else if (bullet["key"] === ga.laserGunBulletImgKey) this.damageDragon(2);
        else if (bullet["key"] === ga.machineGunBulletImgKey || bullet["key"] === ga.sniperBulletImgKey) this.damageDragon(3);
        else if (bullet["key"] === ga.cannonBulletImgKey) this.damageDragon(5);
        bullet["kill"]();

        if (this.dragon.health < 1) Genari.Effect.explosion(this.dragon, false, ga.explosionBig);
        else Genari.Effect.explosion(this.dragon, false, ga.explosionSmall);
    };

    Genari.BossGroup.prototype.pauseDragon = function () {
        if (!this.dragon) return;

        if (this.dragonFire) {
            if (this.dragonFire["animations"]["currentAnim"]) {
                this.dragonFire["animations"]["paused"] = true;
            }
        }
        this.dragon["animations"]["paused"] = true;
        this.dragon.savedVelocity = this.dragon["body"]["velocity"]["y"];
        this.dragon["body"]["velocity"]["y"] = 0;

        if (this.dragonFireStart) {
            this.fireTime = this.phaserGame["time"]["events"]["duration"];
            this.phaserGame["time"]["events"]["remove"](this.dragonFireStart);
            this.phaserGame["time"]["events"]["remove"](this.dragonFireEnd);
        }
    };

    Genari.BossGroup.prototype.resumeDragon = function () {
        if (!this.dragon) return;

        this.dragon["body"]["velocity"]["y"] = this.dragon.savedVelocity;
        if (this.attacking)
            this.dragonAttack(this.fireTime);
        this.dragon["animations"]["paused"] = false;
        if (this.fire)
            this.dragonFire["animations"]["paused"] = false;
    };

    /************************************************************************************
     * Monster bullets
     * @param {Object} layer Rendering layer of this group.
     * @param {boolean} [fixedToCamera] If set to true, it move with camera. The location is then camera offsets.
     * @param {boolean} [enableBody] If set to true, any objects added will have physics enables
     * @param {number} [physicsBodyType] Default 0. Phaser.Physics.ARCADE, Phaser.Physics.P2, Phaser.Physics.NINJA
     * @constructor
     * @extends {Genari.BulletGroup}
     ***********************************************************************************/
    Genari.MonsterBulletGroup = function (layer, fixedToCamera, enableBody, physicsBodyType) {
        if (!(this instanceof Genari.MonsterBulletGroup)) return new Genari.MonsterBulletGroup(layer, fixedToCamera, enableBody, physicsBodyType);  // make sure this refer to a DCGame
        Genari.BulletGroup.call(this, layer, fixedToCamera, enableBody, physicsBodyType);
        this.bulletCount = 0;
        this.bulletTravelDistance = 400;
    };
    Genari.MonsterBulletGroup.prototype = Object.create(Genari.BulletGroup.prototype); // extend DCGroup
    Genari.MonsterBulletGroup.prototype.constructor = Genari.MonsterBulletGroup;        // set constructor property

    Genari.MonsterBulletGroup.prototype.update = function () {
        var ga = this.dcGame;

        this.updateBullets();

        // Check monsters and bullets hit player
        if (!ga.player.isBlinking) {
            ga.phaserGame["physics"]["arcade"]["overlap"](
                ga.player.playerSprite,
                this.getGroup(),
                this.hitPlayer, null, this);
        }

        // Check if bullets hit the platform
        ga.phaserGame["physics"]["arcade"]["collide"](
            this.getGroup(),
            ga.statePlay.tileMapCollisionLayer,
            this.hitWall, null, this
        );
    };

    Genari.MonsterBulletGroup.prototype.hitWall = function (bullet) {
        bullet["kill"]();
    };

    Genari.MonsterBulletGroup.prototype.createBullet = function (x, y, key, xSpeed, ySpeed) {
        var ga = this.dcGame;

        ga.audioPlay(ga.enemyFireBulletSndKey);
        if (this.bulletCount === 0) {
            var bullet = Genari.BulletGroup.prototype.addBullet.call(this, x, y, key, xSpeed, ySpeed, ga.phaserGame["camera"]["width"] / 3);
          //  bullet["animations"]["add"]('AttackLeft', [0, 1, 2,]);
          //  bullet["animations"]["add"]('AttackRight', [ 3, 4, 5]);
          //  bullet["animations"]["add"]('AttackUp', [ 6, 7, 8]);
           // bullet["animations"]["add"]('AttackDown', [ 9, 10, 11]);
           // if (xSpeed<0) bullet["animations"]["play"]['AttackLeft',8,true];
          //  else if (xSpeed>0) bullet["animations"]["play"]['AttackRight',8,true];

            //if (ySpeed < 0) bullet["animations"]["play"]('AttackUp', 8, true);
            //else if (ySpeed>0) bullet["animations"]["play"]('AttackDown', 8, true);

    };

    Genari.MonsterBulletGroup.prototype.spawnBossBullet = function () {
        var ga = this.dcGame;
        var x = ga.groupBoss.dragon["body"]["x"];
        var y = ga.groupBoss.dragon["body"]["y"];
        var xSpeed = 200;
        if (ga.currentGameLevel === 0 || ga.currentGameLevel === 3) {
            xSpeed *= -1;
            }
        }
        if (this.bulletCount === 0) {

            this.bullet1 = this.addBullet(x, y + 45, ga.bossBulletImgKey, xSpeed, 45, 400);
            this.bullet1["body"]["enable"] = true;
            this.bullet1["animations"]["add"]('Attack', [0]);
            this.bullet1["animations"]["play"]('Attack', 1, true);
            this.bullet2 = this.addBullet(x, y + 45, ga.bossBulletImgKey, xSpeed, 0, 400);
            this.bullet2["body"]["enable"] = true;
            this.bullet2["animations"]["add"]('Attack', [0]);
            this.bullet2["animations"]["play"]('Attack', 1, true);
            this.bullet3 = this.addBullet(x, y + 45, ga.bossBulletImgKey, xSpeed, -90, 400);
            this.bullet3["body"]["enable"] = true;
            this.bullet3["animations"]["add"]('Attack', [0]);
            this.bullet3["animations"]["play"]('Attack', 1, true);
        }
    };

    Genari.MonsterBulletGroup.prototype.hitPlayer = function (player, attack) {
        var ga = this.dcGame;
        ga.audioPlay(ga.incorrectSndKey);
        ga.player.killPlayer();
        attack["destroy"]();
        attack["kill"]();
    };

    Genari.MonsterBulletGroup.prototype.pause = function () {
        this.getGroup().forEach(function (bullet) {
            bullet["body"]["enable"] = false;
            console.info(bullet);
            bullet["animations"]["paused"] = true;
        });
    };
    Genari.MonsterBulletGroup.prototype.resume = function () {
        this.getGroup().forEach(function (bullet) {
            bullet["body"]["enable"] = true;
            bullet["animations"]["paused"] = false;
        });
    };

    /************************************************************************************
     * TODO: extend PickupGroup instead?
     * Word boxes
     * @param {Object} layer Rendering layer of this group.
     * @param {boolean} [fixedToCamera] If set to true, it move with camera. The location is then camera offsets.
     * @param {boolean} [enableBody] If set to true, any objects added will have physics enables
     * @param {number} [physicsBodyType] Default 0. Phaser.Physics.ARCADE, Phaser.Physics.P2, Phaser.Physics.NINJA
     * @constructor
     * @extends {Genari.WordBoxGroup}
     ***********************************************************************************/
    Genari.WeaponGroup = function (layer, fixedToCamera, enableBody, physicsBodyType) {
        if (!(this instanceof Genari.WeaponGroup)) return new Genari.WeaponGroup(layer, fixedToCamera, enableBody, physicsBodyType);  // make sure this refer to a DCGame
        Genari.WordBoxGroup.call(this, layer, fixedToCamera, enableBody, physicsBodyType);

        this.weaponBulletCount = 50;
        this.laserGunBulletCount = 40;
        this.machineGunBulletCount = 40;
        this.sniperBulletCount = 30;
        this.cannonBulletCount = 20;

        this.spriteType = ["laserGun", "machineGun", "sniper", "cannon"];
    };
    Genari.WeaponGroup.prototype = Object.create(Genari.WordBoxGroup.prototype); // extend DCGroup
    Genari.WeaponGroup.prototype.constructor = Genari.WeaponGroup;        // set constructor property

    Genari.WeaponGroup.prototype.update = function () {
        var ga = this.dcGame;

        // Check player hits word boxes or pickups
        ga.phaserGame["physics"]["arcade"]["overlap"](
            ga.player.playerSprite,
            this.getGroup(),
            this.getWeapon, null, this
        );
    };

    Genari.WeaponGroup.prototype.getWeapon = function (player, weapon) {
        var ga = this.dcGame;
        //When player touches the right words, the word gets exploded and player gains 1 score.
        ga.audioPlay(ga.collectSndKey);
        // crate["children"][0]["animations"]["play"]('Vanish', 20, false);
        weapon["body"]["enable"] = false;
        ga.phaserGame["time"]["events"]["add"](100, weapon["destroy"], weapon);
        //ga.lifeText.addValue(1);
        var weapons = ga.weapons;

        if (weapon["key"] === "laserGun") {
            if (!weapons[1]["visible"]) weapons[1]["visible"] = weapons[1]["input"]["useHandCursor"] = true;
            ga.groupPlayerBullets.changeBullet(true, ga.laserGunBulletImgKey, ga.laserGunBulletCount);
            if (ga.bulletAssetKey === ga.laserGunBulletImgKey) {
                if (ga.laserGun) {
                    if (ga.laserGunBulletCount + this.laserGunBulletCount <= 50) ga.laserGunBulletCount += this.laserGunBulletCount;
                    else ga.laserGunBulletCount = 50;
                }
                else ga.laserGun = true;
                ga.bulletBar.setValue(ga.laserGunBulletCount);
            }
        } else if (weapon["key"] === "machineGun") {
            if (!weapons[2]["visible"]) weapons[2]["visible"] = weapons[2]["input"]["useHandCursor"] = true;
            ga.groupPlayerBullets.changeBullet(true, ga.machineGunBulletImgKey, ga.machineGunBulletCount);
            if (ga.bulletAssetKey === ga.machineGunBulletImgKey) {
                if (ga.machineGun) {
                    if (ga.machineGunBulletCount + this.machineGunBulletCount <= 50) ga.machineGunBulletCount += this.machineGunBulletCount;
                    else ga.machineGunBulletCount = 50;
                }
                else ga.machineGun = true;
                ga.bulletBar.setValue(this.machineGunBulletCount);
            }
        } else if (weapon["key"] === "sniper") {
            if (!weapons[3]["visible"]) weapons[3]["visible"] = weapons[3]["input"]["useHandCursor"] = true;
            ga.groupPlayerBullets.changeBullet(true, ga.sniperBulletImgKey, ga.sniperBulletCount);
            if (ga.bulletAssetKey === ga.sniperBulletImgKey) {
                if (ga.sniper) {
                    if (ga.sniperBulletCount + this.sniperBulletCount <= 50) ga.sniperBulletCount += this.sniperBulletCount;
                    else ga.sniperBulletCount = 50;
                }
                else ga.sniper = true;
                ga.bulletBar.setValue(ga.sniperBulletCount);
            }
        } else if (weapon["key"] === "cannon") {
            if (!weapons[4]["visible"]) weapons[4]["visible"] = weapons[4]["input"]["useHandCursor"] = true;
            ga.groupPlayerBullets.changeBullet(true, ga.cannonBulletImgKey, ga.cannonBulletCount);
            if (ga.bulletAssetKey === ga.cannonBulletImgKey) {
                if (ga.cannon) {
                    if (ga.cannonBulletCount + this.cannonBulletCount <= 50) ga.cannonBulletCount += this.cannonBulletCount;
                    else ga.cannonBulletCount = 50;
                }
                else ga.cannon = true;
                ga.bulletBar.setValue(ga.cannonBulletCount);
            }
        }
    };

    /**
     * Create treasure boxes with text on top of it as pickup items.
     */
    Genari.WeaponGroup.prototype.createWeapon = function () {
        Genari.createTilemapObjects(
            Genari.dcGame.statePlay.tileMaps["worldTileMap"],
            this,
            'weapons',
            this.spawnWeapon
        );
    };

    /**
     * Create a treasure box with text on top of it as a pickup item using the provided item as the reference location.
     * @param item Used as the reference location
     */
    Genari.WeaponGroup.prototype.spawnWeapon = function (item) {
        var x = item["x"];
        var y = item["y"];
        //var fill = (Genari.isShowHint() == 1 && score > 0) ? '#0000FF' : '#000000';
        //var treasureType = Math.random()*10;
        var spriteName = this.spriteType[Math.floor(Math.random() * this.spriteType.length)];
        var usedKey = this.spriteType.indexOf(spriteName);
        this.spriteType.splice(usedKey, 1);

        this.addSprite(x, y, spriteName, 0);
    };

    /************************************************************************************
     * Manage monsters in maze
     * @param {object} layer Phaser.Group. Rendering layer of this group.
     * @param {boolean} [fixedToCamera] If set to true, it move with camera. The location is then camera offsets.
     * @param {boolean} [enableBody] If set to true, any objects added will have physics enables
     * @param {number} [physicsBodyType] Default 0. Phaser.Physics.ARCADE, Phaser.Physics.P2, Phaser.Physics.NINJA
     * @constructor
     * @extends {Genari.PickupGroup}
     ***********************************************************************************/
    Genari.SpaceshipGroup = function (layer, fixedToCamera, enableBody, physicsBodyType) {
        if (!(this instanceof Genari.SpaceshipGroup)) return new Genari.SpaceshipGroup(layer, fixedToCamera, enableBody, physicsBodyType);  // make sure this refer to a DCGame
        Genari.PickupGroup.call(this, layer, fixedToCamera, enableBody, physicsBodyType);
    };
    Genari.SpaceshipGroup.prototype = Object.create(Genari.PickupGroup.prototype); // extend DCGroup
    Genari.SpaceshipGroup.prototype.constructor = Genari.SpaceshipGroup;       // set constructor property

    Genari.SpaceshipGroup.prototype.createSpaceship = function () {
        var ga = this.dcGame;
        this.createFromObjects(ga.statePlay.tileMaps["worldTileMap"], 'boss', 'spaceship', ga.spaceShipImgKey, 0, true, false);
    };

    Genari.SpaceshipGroup.prototype.update = function () {
        var ga = this.dcGame;
        ga.phaserGame["physics"]["arcade"]["overlap"](
            ga.player.playerSprite,
            this.getGroup(),
            this.endGame, null, this
        );
    };

    Genari.SpaceshipGroup.prototype.pause = function () {
        this.getGroup().forEach(function (spaceship) {
            spaceship["animations"]["paused"] = true;
        });
    };

    Genari.SpaceshipGroup.prototype.resume = function () {
        this.getGroup().forEach(function (spaceship) {
            spaceship["animations"]["paused"] = false;
        });
    };

    Genari.SpaceshipGroup.prototype.endGame = function () {
        var ga = this.dcGame;
        ga.audioStop(ga.backgroundMusicKey);
        ga.bulletAssetKey = ga.pistolBulletImgKey;
        ga.saveAndStartNextLevel();
    };

    /**
     * TODO: replace with Genari.Group.createFromObjects
     * @param tileMap
     * @param className
     * @param layerName
     * @param callBack
     */
    Genari.createTilemapObjects = function (tileMap, className, layerName, callBack) {
        tileMap["objects"][layerName].forEach(function (item) {
            callBack.call(className, item);
        });
    };
}
    // DEVELOPER_CODE REMOVE_FOR_THEME
