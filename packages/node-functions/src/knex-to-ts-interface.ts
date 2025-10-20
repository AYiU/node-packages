/** biome-ignore-all lint/complexity/noArguments: Check later */
import type { Knex } from "knex";

const stringType = [
  "text",
  "tinytext",
  "mediumtext",
  "longtext",
  "blob",
  "mediumblob",
  "longblob",
  "geometry",
];

const dateType = ["datetime", "date", "time", "timestamp"];

const numberType = ["float", "double"];

interface ShowColumnsFields {
  Field: string;
  Type: string;
  Null: "YES" | "NO";
  Key: string;
  Default?: string;
  Extra: string;
}

export async function generateTsInterfaceFromMySql(knex: Knex) {
  const tables = await knex.raw("SHOW TABLES");
  const colKey = tables[1][0].name;
  let output = "";

  for (let t = 0; t < tables[0].length; t++) {
    const table = tables[0][t][colKey];

    const r = await knex.raw<ShowColumnsFields[][]>(
      `SHOW columns FROM ${table}`,
    );

    const rowData = r[0];
    const buffer: string[] = [];

    let withAutoIncrement = "";

    for (let i = 0; i < rowData.length; i++) {
      let tsType = "";
      const colInfo = rowData[i];

      if (
        colInfo.Type.startsWith("varchar") ||
        colInfo.Type.startsWith("char") ||
        colInfo.Type.startsWith("set") ||
        stringType.indexOf(colInfo.Type) !== -1
      ) {
        tsType = "string";
      } else if (
        colInfo.Type.startsWith("int") ||
        colInfo.Type.startsWith("tinyint") ||
        colInfo.Type.startsWith("smallint") ||
        colInfo.Type.startsWith("mediumint") ||
        colInfo.Type.startsWith("bigint") ||
        "year" === colInfo.Type
      ) {
        tsType = "number";
      } else if (
        numberType.indexOf(colInfo.Type) !== -1 ||
        colInfo.Type.startsWith("decimal") ||
        colInfo.Type.startsWith("float") ||
        colInfo.Type.startsWith("double")
      ) {
        tsType = "number";
      } else if (colInfo.Type.startsWith("enum")) {
        // biome-ignore lint/security/noGlobalEval: -
        tsType = eval(`test${colInfo.Type}`);
      } else if (dateType.indexOf(colInfo.Type) !== -1) {
        tsType = "Date";
      } else if ("json" === colInfo.Type) {
        tsType = "any";
      } else {
        console.log(table, colInfo);
        throw new Error("Unknown type");
      }

      if (tsType) {
        const optional = "YES" === colInfo.Null ? "?" : "";

        buffer.push(
          `  ${formatFieldName(colInfo.Field)}${optional}: ${tsType};`,
        );
      }

      if ("auto_increment" === colInfo.Extra) {
        withAutoIncrement = colInfo.Field;
      }
    }

    output += `interface ITable_${table} {\n${buffer.join("\n")}\n}\n\n`;

    if (withAutoIncrement.length > 0) {
      output += `type ITable_${table}_omit_id = Omit<ITable_${table}, "id">;\n\n`;
    }
  }

  return output;
}

function formatFieldName(name: string) {
  if (name.indexOf("-") !== -1) {
    return `"${name}"`;
  }
  return name;
}

/**
 * Use below : tsType = eval("test" + colInfo.Type);
 * @returns
 */
// biome-ignore lint/correctness/noUnusedVariables: called by eval
function testenum() {
  const f: string[] = [];

  for (let i = 0; i < arguments.length; i++) {
    f.push(`"${arguments[i]}"`);
  }

  return f.join(" | ");
}
