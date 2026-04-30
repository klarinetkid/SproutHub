const unsigned long READ_INTERVAL_MS = 5UL * 60UL * 1000UL; // 5 min

void setup() {
  Serial.begin(9600);
}

void loop() {
  int moisture = analogRead(A0);
  Serial.print("|1001|");
  Serial.print(moisture);
  Serial.println("|");
  delay(READ_INTERVAL_MS);
}