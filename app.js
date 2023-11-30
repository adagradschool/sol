function init() {
    // Data
    const data = {"City Ambiance": ["Siren clear", "Airplane, Garbage truck", "Borough Market", "Piccadilly, multilingual, honking", "Harry Potter Store1", "Borough Market Conversations", "Wind", "Hello, conversations", "Honk", "Church bell", "Clear walking noises in the city", "Police siren in the distance", "Church bell", "Multilingual, Children playing in Park", "Walking over dried leaves", "Random street", "Distant construction noise, walking, multi", "Walking", "Chinatown, garbage truck, cycle tring", "Distant song", "Traffic light sound", "Walking, some footsteps", "Bad footsteps", "Walking, some footsteps", "Construction"], "Live Entertainment": ["Audience interaction", "Music rickshaw", "Concert", "Concert begins", "Gospel song in the street", "Singing at the traffic light", "Concert screams", "Concert, Appllo Eventim", "GOT in Leicester station", "Borough Market Conversations", "Sammy and the Friends Concert", "Busking, noise of the city, ambulance", "Concert,\u00a0Appllo\u00a0Eventim"], "Urban Transit": ["Train announcements", "Piccadilly line", "Station exit stand", "Inside train, muffled", "Northern line train", "Calmer bus sound", "Climbing up bus", "Ticket gate", "London Bridge, uber boat", "Station escalator", "Station tunnel", "Inside train, muffled", "Train ticket turnstile", "Bus stop button sound", "Bus stopping, thanking bus driver", "Train station, climbing stairs"], "City Exploration": ["Walking tour, mentions Roman rule", "Walking tour referencing itself", "Walking tour, mention of museums", "Walking tour", "Walking through West End"], "Cultural Atmosphere": ["Borough Market Conversations", "Kids in Museum", "Kids in Museum 2", "Singing at the traffic light", "Walking tour, mentions Roman rule", "Walking tour referencing itself", "Multilingual, Children playing in Park"], "Eclectic Urban Moments": ["Hot dog, siren", "Bus Stop Button Sounds", "Youth conversing", "Borough Market", "Piccadilly, multilingual, honking", "Harry Potter Store1", "GOT in Leicester station", "Walking through West End", "Train station, violin, steps", "Ash alarm, garbage truck", "Groovy beats on the street, followed by laughter", "Pedestrian laughter", "Distant song", "Running up to meet Zosia", "Happy birthday song"]};
    // Constants
    const preload = new createjs.LoadQueue();
    preload.installPlugin(createjs.Sound);
    Object.values(data).forEach((audios, index) => {
        audios.forEach((audio, index) => {
            preload.loadFile({id: audio, src: "data/" + audio + ".m4a"});
        });
    });
    // preload.loadManifest([
    // { id: "audio1", src: "path/to/audio1.wav" },
    // { id: "audio2", src: "path/to/audio2.wav" },
    // ]);
    const stageRadius = 400;
    const categoryCount = 6;
    const soundSizes = Object.keys(data).map(key => data[key].length);
    const colors = shuffleArray([
        "#3498db", // Blue
        "#2ecc71", // Green
        "#e74c3c", // Red
        "#f39c12", // Orange
        "#9b59b6", // Purple
        "#2c3e50"  // Dark Blue
      ]);     
    // Initialize stage
    const stage = new createjs.Stage("demoCanvas");
    stage.enableMouseOver(10);
    stage.canvas.width = 2 * stageRadius;
    stage.canvas.height = 2 * stageRadius;


    // Draw big circle
    const bigCircle = createCircle(stageRadius, stageRadius, stageRadius, "lightgrey");
    const categoryCircles = createCategoryCircles(categoryCount, stageRadius, stageRadius, stageRadius, null);
    var text = new createjs.Text("Sounds of London", "20px Arial", "pink");
    text.x = 400 - 80;
    text.y = 400;
    text.textBaseline = "alphabetic";
    stage.addChild(text);
    stage.update();

    // Function to create Category Circles
    function createCategoryCircles(count, centreX, centreY, centreRadius, color) {
        const circles = [];
        const angleIncrement = (2 * Math.PI) / count;
        const categoryCircleRadius = (centreRadius * Math.sin(angleIncrement / 2)) / (1 + Math.sin(angleIncrement / 2));

        for (let i = 0; i < count; i++) {
            const angle = i * angleIncrement;
            const x = centreX + (centreRadius - categoryCircleRadius) * Math.cos(angle);
            const y = centreY + (centreRadius - categoryCircleRadius) * Math.sin(angle);
            const categoryName = Object.keys(data)[i];
            var text = new createjs.Text(categoryName, "12px Arial", colors[i]);
            text.x = x - categoryCircleRadius/2.7;
            text.y = y;
            text.textBaseline = "alphabetic";
            stage.addChild(text);
            const categoryCircle = createCircle(x, y, categoryCircleRadius, color);
            soundCircles = createSoundCircles(soundSizes[i], x, y, categoryCircleRadius, colors[i], categoryName);
            // createCategoryCircles(soundSizes[i], x, y, categoryCircleRadius, "lightgreen");
            stage.addChild(categoryCircle);
            
            
            // categoryCircle.addChild(createSoundCircles()); // Add Sound Circles to Category Circle

            circles.push(categoryCircle);
        }
        return circles;
    }

    function createSoundCircles(count, centreX, centreY, centreRadius, color, categoryName) {
        const circles = [];
        const angleIncrement = (2 * Math.PI) / count;
        const soundCircleRadius = (centreRadius * Math.sin(angleIncrement / 2)) / (1 + Math.sin(angleIncrement / 2));

        for (let i = 0; i < count; i++) {
            const angle = i * angleIncrement;
            const x = centreX + (centreRadius - soundCircleRadius) * Math.cos(angle);
            const y = centreY + (centreRadius - soundCircleRadius) * Math.sin(angle);
            const soundCircle = createCircle(x, y, soundCircleRadius, color);
            soundCircle.category = categoryName;
            soundCircle.name = data[categoryName][i];
            soundCircle.music_path = "music/" + soundCircle.name + ".mp3";

            const tooltip = createTooltip(soundCircle.name, soundCircle.category);
            stage.addChild(tooltip);
            soundCircle.tooltip = tooltip;
            soundCircle.addEventListener("mouseover", handleMouseOver);
            soundCircle.addEventListener("mouseout", handleMouseOut);
            soundCircle.addEventListener("click", handleMouseClick);
            stage.addChild(soundCircle);
            
            // categoryCircle.addChild(createSoundCircles()); // Add Sound Circles to Category Circle

            // circles.push(categoryCircle);
        }
        return circles;
    }


    // Function to create tooltip
    function createTooltip(name, description) {
        const tooltip = new createjs.Container();
        
        const background = new createjs.Shape();
        background.graphics.beginFill("rgba(255, 255, 255, 0.9)").drawRect(0, 0, 120, 40);
        tooltip.addChild(background);

        const text = new createjs.Text(`${name}`, "12px Arial", "#000");
        text.textAlign = "left";
        text.textBaseline = "top";
        text.x = 5;
        text.y = 5;
        tooltip.addChild(text);

        tooltip.visible = false; // Hide the tooltip initially

        return tooltip;
    }

    // Function to create a circle
    function createCircle(x, y, radius, color) {
        const circle = new createjs.Shape();
        circle.graphics.beginFill(color).drawCircle(0, 0, radius);
        circle.x = x;
        circle.y = y;
        return circle;
    }

    // Event handlers
    function handleMouseOver(event) {
        // Show Tooltip
        // You can use Tween.js for animation effects
        
        const soundCircle = event.target;
        createjs.Tween.get(soundCircle).to({ scaleX: 1.2, scaleY: 1.2 }, 100);
        soundCircle.tooltip.visible = true;
        soundCircle.tooltip.x = soundCircle.x + 20; // Adjust the tooltip position
        soundCircle.tooltip.y = soundCircle.y - 40;
        stage.addChild(soundCircle.tooltip);
        createjs.Sound.play(soundCircle.name);
        stage.update();
    }

    function handleMouseOut(event) {
        // Hide Tooltip
        const soundCircle = event.target;
        createjs.Sound.stop();
        createjs.Tween.get(soundCircle).to({ scaleX: 1, scaleY: 1 }, 100).call(() => {
            soundCircle.tooltip.visible = false; // Hide the tooltip after the animation is complete
            stage.update(); // Update the stage to hide the tooltip
            
        }) // Adjust the duration and properties as needed
    }

    function handleMouseClick(event) {
        // Play corresponding sound
        console.log("Mouse Click");
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}