const Koa = require("koa");
const Router = require("koa-router");
const cors = require("@koa/cors");
const fs = require("fs").promises;
const path = require("path");

const app = new Koa();
const router = new Router();

app.use(cors());

app.use(require("koa-body")());

router.get("/todos", async (ctx) => {
  try {
    const todos = await fs.readFile(
        path.join(__dirname, "todos.json"),
        "utf-8"
    );
    ctx.body = JSON.parse(todos);
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
});

router.post("/todos", async (ctx) => {
  try {
    const { text } = ctx.request.body;
    const todos = JSON.parse(
        await fs.readFile(path.join(__dirname, "todos.json"), "utf-8")
    );
    const lastId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), 0);
    const newTodo = { id: lastId + 1, text, isCompleted: false };
    todos.push(newTodo);
    await fs.writeFile(
        path.join(__dirname, "todos.json"),
        JSON.stringify(todos, null, 2)
    );
    ctx.body = newTodo;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
});

router.put("/todos/:id", async (ctx) => {
  try {
    const { id } = ctx.params;
    const { text, isCompleted } = ctx.request.body;
    const todos = JSON.parse(
        await fs.readFile(path.join(__dirname, "todos.json"), "utf-8")
    );
    const index = todos.findIndex((todo) => todo.id === parseInt(id));
    if (index !== -1) {
      todos[index] = { id: parseInt(id), text, isCompleted };
      await fs.writeFile(
          path.join(__dirname, "todos.json"),
          JSON.stringify(todos, null, 2)
      );
      ctx.body = todos[index];
    } else {
      ctx.status = 404;
      ctx.body = { error: "Todo not found" };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
});

router.delete("/todos/:id", async (ctx) => {
  try {
    const { id } = ctx.params;
    const todos = JSON.parse(
        await fs.readFile(path.join(__dirname, "todos.json"), "utf-8")
    );
    const index = todos.findIndex((todo) => todo.id === parseInt(id));
    if (index !== -1) {
      const deletedTodo = todos.splice(index, 1)[0];
      await fs.writeFile(
          path.join(__dirname, "todos.json"),
          JSON.stringify(todos, null, 2)
      );
      ctx.body = deletedTodo;
    } else {
      ctx.status = 404;
      ctx.body = { error: "Todo not found" };
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
});

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
