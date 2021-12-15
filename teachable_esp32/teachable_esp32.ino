void setup() {
  Serial.begin(115200);
  pinMode(14,INPUT);
  pinMode(27,INPUT);
}

void loop() {
  int Mask = digitalRead(14);
  int NoMask = digitalRead(27);
  Serial.print("Mask:");
  Serial.print(Mask);
  Serial.print(" NoMask:");
  Serial.println(NoMask);
  
  if(Mask == 1){

  }
  else if(NoMask == 1){

  }
}
