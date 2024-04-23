let handpose;
let video;
let predictions = [];
let sparkleArray = [];
let tickCounter = 0;
let allSubs = "";
let lastSentance = "";

const subtitle = document.getElementById("subtitle")


letterIdeals = [
    [100, 180, 70, 20, 60, 120], //a
    [90, 80, 280, 320, 300, 230], //b
    [80, 150, 170, 180, 180, 170], //c
    [60, 30, 210, 15, 20, 40], //d
    [120, 130, 180, 160, 140, 140], //e
    [65, 70, 55, 220, 210, 180], //f
    [30, 120, 220, 100, 85, 85], //g
    [30, 85, 180, 185, 65, 65], //h
    [55, 90, 50, 15, 30, 160], //i
    [300, 300, 300, 300, 300, 300], // -j
    [60, 110, 220, 240, 20, 35], //k
    [65, 140, 220, 22, 40, 60], //l
    [300, 300, 300, 300, 300, 300], // -m
    [300, 300, 300, 300, 300, 300], //- n
    [80, 130, 130, 120, 110, 100],  //o
    [300, 300, 300, 300, 300, 300], // -p
    [300, 300, 300, 300, 300, 300], // -q
    [70, 60, 180, 200, 20, 30], //r
    [80, 140, 110, 90, 30, 65], //s
    [60, 85, 90, 25, 20, 40], //t
    [300, 300, 300, 300, 300, 300], // -u
    [70, 60, 240, 260, 25, 35], //v
    [70, 70, 220, 230, 220, 50], //w
    [300, 300, 300, 300, 300, 300], // -x
    [300, 300, 300, 300, 300, 300], // -y
    [300, 300, 300, 300, 300, 300], // -z
    [60, 120, 160, 170, 160, 145], // " "
    [40, 90, 90, 60, 15, 31] //.
]

function compare(myList) {
    current = myList;
    
    let index = 0;
    let min = 1000;
    for (let i = 0; i < letterIdeals.length; i++){
        let temp = 0;
        for (let j = 1; j < current.length; j++){
            temp += ((current[j] / current[0] - letterIdeals[i][j] / letterIdeals[i][0]) / ((letterIdeals[i][j]+20) / (letterIdeals[i][0]+20))) ** 2;
            //console.log(String.fromCharCode('a'.charCodeAt(0) + i) + "," + j + ": " + ((current[j] / current[0] - letterIdeals[i][j] / letterIdeals[i][0]) / (letterIdeals[i][j] / letterIdeals[i][0])) ** 2);
        }

        if (temp < min){
            min = temp;
            index = i;
        }       
    }

    console.log(min)
    ans = String(String.fromCharCode('a'.charCodeAt(0) + index))
    if (ans == "{"){
        ans = " "
    }
    if (ans == "|"){
        ans = "."
    }
    return ans;
//currentStretch.innerHTML = String.fromCharCode('a'.charCodeAt(0) + index) + ": " + min;
}

function setup() {
    //var canvas = createCanvas(640, 480);
     var canvas = createCanvas(480, 640);
    canvas.parent('frame');
    video = createCapture(VIDEO);
    video.size(windowWidth, windowHeight);
    console.log("setup")
    handpose = ml5.handpose(video, modelReady);

    document.getElementById('frame').firstChild.style.width = "100%"
    document.getElementById('frame').firstChild.style.height = "100%"
    // This sets up an event that fills the global variable "predictions"
    // with an array every time new hand poses are detected
    handpose.on("predict", results => {
      predictions = results;
    });
  
    // Hide the video element, and just show the canvas
    video.hide();
}

function modelReady(){
    console.log("loaded")

}

function distance(x1, y1, x2, y2) {
    return Math.round(Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)))
}

function yell(toYell){
    var msg = new SpeechSynthesisUtterance();
    msg.text = toYell;
    window.speechSynthesis.speak(msg);
}

function draw() {
    image(video, 0, 0, width, height);
    drawKeypoints()
}
let speed = 39;
document.getElementById("slider").onchange = () =>{
    if(document.getElementById("slider").value == 0){
        speed = 59
    }
    else if(document.getElementById("slider").value == 1){
        speed = 39
    }
    else{
        speed = 18
    }
}
function drawKeypoints() {
good = [0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15, 17, 18, 19]
averagePoints = [0, 1, 2, 5, 9, 17]
goodDistance = [1, 4, 8, 12, 16, 20]
for (let i = 0; i < predictions.length; i += 1) {
    myList = []
    const prediction = predictions[i];
    
    avgX = 0
    avgY = 0
    xStrings = ""
    yStrings = ""
    for (let j = 0; j < averagePoints.length; j += 1) {
        const keypoint = prediction.landmarks[averagePoints[j]];
        avgX += keypoint[0]
        xStrings += String(Math.round(keypoint[0])) + ", " 
        avgY += keypoint[1]
        yStrings += String(Math.round(keypoint[1])) + ", "
    }
    avgX /= averagePoints.length
    avgY /= averagePoints.length
    fill(255, 0, 0)
    ellipse(avgX, avgY, 10, 10);
    //nextStretch.innerHTML = "X Pos: " + xStrings + "Y Pos: " + yStrings + "\n" + String(avgX) + ", " +  String(avgY)

    for (let j = 0; j < prediction.landmarks.length; j += 1) {
    const keypoint = prediction.landmarks[j];
    fill(255,255,255);

    if (goodDistance.includes(j)){
        myList.push(distance(avgX, avgY, keypoint[0], keypoint[1]))
    }
    textSize(12);
    text((String(j) + ": " + String(distance(avgX, avgY, keypoint[0], keypoint[1]))),keypoint[0], keypoint[1] + 20);
    

    if (good.includes(j)){
        const keypoint1 = prediction.landmarks[j+1];
        line(keypoint[0], keypoint[1], keypoint1[0], keypoint1[1])
    }
    stroke(0,0,0);
    ellipse(keypoint[0], keypoint[1], 10, 10);
    }
    tickCounter++;
    if (tickCounter > (speed/5)){
        temp = String(compare(myList))
        textSize(30)
        text(temp + ".", 30, 30)
        textSize(12)
    }
    if (tickCounter > speed){
        tickCounter = 0;
        if (predictions.length > 0){
            temp = String(compare(myList))
            if (lastSentance == ""){
                allSubs += temp.toUpperCase()
            } else{
                allSubs += temp
            }
            lastSentance += temp
            subtitle.innerHTML = allSubs
            if (temp == ".") {
                yell(lastSentance)
                lastSentance = "";
                allSubs += " "
            }
        }
    }
    //call quality functions here
    
    const keypoint0 = prediction.landmarks[0];
    const keypoint2 = prediction.landmarks[2];
    const keypoint4 = prediction.landmarks[4];
    const keypoint5 = prediction.landmarks[5];
    const keypoint8 = prediction.landmarks[8];
    const keypoint9 = prediction.landmarks[9];
    const keypoint13 = prediction.landmarks[13];
    const keypoint17 = prediction.landmarks[17];
    line(keypoint0[0], keypoint0[1], keypoint17[0], keypoint17[1])
    line(keypoint13[0], keypoint13[1], keypoint17[0], keypoint17[1])
    line(keypoint13[0], keypoint13[1], keypoint9[0], keypoint9[1])
    line(keypoint9[0], keypoint9[1], keypoint5[0], keypoint5[1])
    line(keypoint5[0], keypoint5[1], keypoint2[0], keypoint2[1])
    // compare(myList);
    // hi
    // currentStretch.innerHTML = getAngle(keypoint4[0], keypoint4[1], keypoint2[0], keypoint2[1], keypoint5[0], keypoint5[1])
}
}
