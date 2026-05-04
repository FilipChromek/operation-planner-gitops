const mongoHost = process.env.OR_PLANNER_API_MONGODB_HOST;
const mongoPort = process.env.OR_PLANNER_API_MONGODB_PORT;
const mongoUser = process.env.OR_PLANNER_API_MONGODB_USERNAME;
const mongoPassword = process.env.OR_PLANNER_API_MONGODB_PASSWORD;
const database = process.env.OR_PLANNER_API_MONGODB_DATABASE;
const retrySeconds = parseInt(process.env.RETRY_CONNECTION_SECONDS || "5") || 5;

const collections = ["rooms", "patients", "staff"];

let connection;
while (true) {
  try {
    connection = Mongo(`mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}`);
    break;
  } catch (e) {
    print(`Cannot connect to mongoDB: ${e}`);
    print(`Will retry after ${retrySeconds} seconds`);
    sleep(retrySeconds * 1000);
  }
}

const db = connection.getDB(database);

for (const col of collections) {
  if (!db.getCollectionNames().includes(col)) {
    db.createCollection(col);
    db[col].createIndex({ id: 1 });
    print(`Created collection ${col}`);
  } else {
    print(`Collection ${col} already exists`);
  }
}

// Sample seed: one room with predefined procedures
if (db.rooms.countDocuments() === 0) {
  db.rooms.insertOne({
    id: "or-1",
    number: "101",
    name: "Operačná sála 1",
    type: "general",
    capacity: 6,
    equipment: ["OR table", "Anesthesia machine", "Surgical lights"],
    status: "active",
    scheduledOperations: [],
    predefinedProcedures: [
      { code: "appendectomy", name: "Apendektómia", typicalDurationMinutes: 60 },
      { code: "cholecystectomy", name: "Cholecystektómia", typicalDurationMinutes: 90 },
      { code: "hernia-repair", name: "Operácia prietrže", typicalDurationMinutes: 75 },
      { code: "knee-arthroscopy", name: "Artroskopia kolena", typicalDurationMinutes: 45 }
    ],
    archived: false
  });
  print("Inserted seed room or-1");
}

if (db.patients.countDocuments() === 0) {
  db.patients.insertOne({
    id: "p-1",
    firstName: "Jozef",
    lastName: "Mrkvička",
    birthNumber: "850101/1234",
    contact: "+421 900 000 001",
    insurance: "VšZP",
    archived: false
  });
  print("Inserted seed patient p-1");
}

if (db.staff.countDocuments() === 0) {
  db.staff.insertOne({
    id: "staff-1",
    firstName: "Anna",
    lastName: "Nováková",
    role: "doctor",
    specialization: "Chirurgia",
    availability: [],
    archived: false
  });
  print("Inserted seed staff staff-1");
}

process.exit(0);
