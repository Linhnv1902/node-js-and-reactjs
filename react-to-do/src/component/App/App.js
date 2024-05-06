import React, {useCallback, useState, useEffect} from "react";
import {Button, Modal, ResourceList, TextField, Text, LegacyCard, ResourceItem} from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import "./App.css";

function AddTodoList({addTodo}) {
    const [active, setActive] = useState(true);

    const handleChange = useCallback(() => setActive(!active), [active]);

    const activator = <Button onClick={handleChange}>Create todo</Button>;
    const [value, setValue] = React.useState("");
    const handleTextFieldChange = useCallback(
        (value: string) => setValue(value),
        [],
    );
    const handleSubmit = e => {
        e.preventDefault();
        if (!value) return;
        addTodo(value);
        handleChange()
        setValue("");
    };
    return (
        <div>
            <Modal
                activator={activator}
                open={active}
                onClose={handleChange}
                title="Create a new todo"
                primaryAction={{
                    content: 'Save',
                    onAction: handleSubmit,
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: handleChange,
                    },
                ]}
            >
                <Modal.Section>
                    <TextField
                        value={value}
                        onChange={handleTextFieldChange}
                        placeholder="This is my todo name"
                        autoComplete="off"
                    />
                </Modal.Section>
            </Modal>
        </div>
    );
}

function RenderToDoBulkActionsExample({items, completeTodo, deleteTodo}) {
    const resourceName = {
        singular: 'todo',
        plural: 'todos',
    };
    const [selectedItems, setSelectedItems] = useState([])

    const promotedBulkActions = [
        {
            content: 'Complete ',
            onAction: () => completeTodo(selectedItems),
        },
        {
            content: 'Delete',
            onAction: () => deleteTodo(selectedItems),
        },
    ];


    return (
        <LegacyCard>
            <ResourceList
                showHeader={true}
                headerContent={`showing ${items.length} todos `}
                items={items}
                resourceName={resourceName}
                renderItem={renderItem}
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
                promotedBulkActions={promotedBulkActions}
                selectable
            >
            </ResourceList>
        </LegacyCard>
    );

    function renderItem(item: typeof items[number]) {
        const {id, text, isCompleted} = item;

        return (
            <ResourceItem
                id={id}
            >
                <div className={"mp-info-todo"}>
                    <Text variant="bodyMd" fontWeight="bold" as="h3">
                        {text}
                    </Text>
                    <div className={"mp-info-todo-action"}>
                        <text
                            className={isCompleted ? "status mp-complete" : "status mp-pending"}> {isCompleted ? "Done" : "Pending"}</text>
                        <Button id={"mp-todo-complete"} onClick={() => completeTodo([id])}>Complete</Button>
                        <Button id={"mp-todo-delete"} onClick={() => deleteTodo([id])}>Delete</Button>
                    </div>
                </div>
            </ResourceItem>
        );
    }
}

function App() {
    const [todos, setTodos] = React.useState([]);
    useEffect(() => {
        fetch("http://localhost:5000/todos")
            .then((response) => response.json())
            .then((data) => setTodos(data))
            .catch((error) => console.error("Error fetching todos:", error));
    }, []);

    const completeTodo = (ids) => {
        ids= String(ids);
        const updatedTodos = todos.map((todo) =>
            ids.includes(todo.id) ? { ...todo, isCompleted: true } : todo
        );
        setTodos(updatedTodos);
        ids.forEach((id) => {
            fetch(`http://localhost:5000/todos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: todos.find((todo) => parseInt(todo.id) === parseInt(id)).text,
                    isCompleted: true,
                }),
            }).catch((error) =>
                console.error(`Error completing todo with id ${id}:`, error)
            );
        });
    };

    const addTodo = (text) => {
        const lastId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), 0) + 1;

        fetch("http://localhost:5000/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: lastId,
                text: text,
                isCompleted: false,
            }),
        })
            .then((response) => response.json())
            .then((newTodo) => {
                setTodos([...todos, newTodo]);
            })
            .catch((error) => console.error("Error adding todo:", error));
    };

    const deleteTodo = (ids) => {
        alert(ids.split(','))

        ids.forEach((id) => {
            fetch(`http://localhost:5000/todos/${id}`, {
                method: "DELETE",
            }).catch((error) =>
                console.error(`Error deleting todo with id ${id}:`, error)
            );
        });
    };
    return (
        <div className="app">
            <div className="todo-list">
                <div className="container create-todo">
                    <span>Todoes</span>
                    <AddTodoList addTodo={addTodo}/>
                </div>
                <RenderToDoBulkActionsExample
                    items={todos}
                    completeTodo={completeTodo}
                    deleteTodo={deleteTodo}
                />

            </div>
        </div>
    );
}

export default App;