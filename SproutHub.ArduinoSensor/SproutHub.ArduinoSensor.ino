const unsigned long READ_INTERVAL_MS = 5UL * 60UL * 1000UL; // 5 min
const int ID_SEED = 1001;
const int SENSOR_COUNT = 2;

void setup() {
  Serial.begin(9600);
}

void loop() {
  for (int i = 0;i < SENSOR_COUNT;i++) {
    int moisture = analogRead(A0 + i);
    Serial.print("|");
    Serial.print(ID_SEED + i);
    Serial.print("|");
    Serial.print(moisture);
    Serial.println("|");
  }
  delay(READ_INTERVAL_MS);
}