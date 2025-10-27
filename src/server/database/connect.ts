import { DataSource, DataSourceOptions } from "typeorm";
import * as system from "../../system/index.js";

var settings = system.getSettingsFile();

// false conection for not error...
var db = new DataSource({
  database: ":memory",
  type: "postgres",
  entities: [],
});

export { db };
export default async function (props: DataSourceOptions) {
  var entities = (await system.getAllSchemas()).map((x) => x.entity);

  var databaseConnection = new DataSource({
    ...props,
    entities,
  });

  //connect and repass for unique instance variable.
  await databaseConnection.initialize();
  db = databaseConnection;

  //create manager access;
  if (settings.auth) {
    console.log("-> Creating manager access.");

    try {
      var userSchema = entities.find((x) => x.name === "User");
      var userRepository = db.getRepository(userSchema);

      let login = process.env.MANAGER_LOGIN;
      if (!login) {
        login = settings.manager.login;
      }

      let firstName = process.env.MANAGER_FIRST_NAME;
      if (!firstName) {
        firstName = settings.manager.firstName;
      }

      let lastName = process.env.MANAGER_LAST_NAME;
      if (!lastName) {
        lastName = settings.manager.lastName;
      }

      let password = process.env.MANAGER_PASSWORD;
      if (!password) {
        password = settings.manager.password;
      }

      var manager = userRepository.create({
        fn: firstName,
        ln: lastName,
        lg: login,
        ps: password,
        rl: [
          {
            sm: "all",
            mt: "all",
          },
        ],
      });

      if (!(await userRepository.findOne({ where: { lg: manager.lg } }))) {
        userRepository.save(manager);
      }
    } catch (error) {
      console.error(
        "[database] - Manager don't created, verify manager data in settings (opposer-settings) or in env."
      );
    }
  }

  return db;
}
