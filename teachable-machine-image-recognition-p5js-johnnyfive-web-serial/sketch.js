const labels = [
    'Mask', 
    'NoMask', 
];
const ledPins = [
    2, // pin 2 for Class 1
    3 // pin 3 for Class 2
];

let classifier,
    video,
    flippedVideo,
    label = '',
    conf = 0,
    boardConnected = false,
    leds = [];

function preload() {
    loadBoard();

    //將模型參數引入，並建立分類器
    classifier = ml5.imageClassifier('./image_model/model.json');
}

function setup() {
    p5.j5.events.on('boardReady', () => {
        ledPins.forEach(pin => {
            //透過johnny-five套件建立LED的控制物件
            leds.push(new five.Led(pin));
        });
        boardConnected = true;
    });
    createCanvas(320, 260);
    video = createCapture(VIDEO);
    video.size(320, 240);
    video.hide();
    flippedVideo = ml5.flipImage(video);

    //定時每10ms辨識一次
    setInterval(classifyVideo, 10);
}

function draw() {
    background(0);
    image(flippedVideo, 0, 0);
    fill(255);
    textSize(16);
    textAlign(CENTER);
    text(`Result: ${label} (${conf} %)`, width / 2, height - 4);
    setBoard();
}

//將圖片進行分類辨識，並將結果傳至gotResult函式
function classifyVideo() {
    flippedVideo = ml5.flipImage(video)
    classifier.classify(flippedVideo, gotResult);
    flippedVideo.remove();
}

function gotResult(error, results) {
    if (error) {
        console.error(error);
        return;
    }
    label = String(results[0].label);   //儲存辨識結果的標籤
    conf = Math.round(Number(results[0].confidence) * 10000) / 100; //運算信心指數
    console.log(`Result: ${label} (${conf} %)`);
}

//設定Arduino控制
function setBoard() {
    if (boardConnected) {
        //判斷是labels中的第幾項
        let labelIndex = labels.indexOf(label);
        //迴圈設定每一顆LED狀態
        leds.forEach((led, index) => {
            if (led) {
                //如果辨識的標籤符合並且信心指數高於85分，設定LED ON
                if (labelIndex == index && conf >= 85) {
                    led.on();
                } else {
                    led.off();
                }
            }
        });
    }
}
