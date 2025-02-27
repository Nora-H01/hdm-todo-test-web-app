/**
 * @todo YOU HAVE TO IMPLEMENT THE DELETE AND SAVE TASK ENDPOINT, A TASK CANNOT BE UPDATED IF THE TASK NAME DID NOT CHANGE, YOU'VE TO CONTROL THE BUTTON STATE ACCORDINGLY
 */
import { Check, Delete} from '@mui/icons-material';
import { Box, Button,Container, MenuItem,IconButton, Select, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.ts';
import { Task } from '../index';

const TodoPage = () => {
  const api = useFetch();
  const [tasks, setTasks] = useState<Task[]>([]);

  const [editedTasks, setEditedTasks] = useState<{ [key: number]: string }>({});
  const [newTaskName, setNewTaskName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStatusTaskId, setLoadingStatusTaskId] = useState<number | null>(null);


  const handleFetchTasks = async () => setTasks(await api.get('/tasks'));

  const handleDelete = async (id: number) => {
    // @todo IMPLEMENT HERE : DELETE THE TASK & REFRESH ALL THE TASKS, DON'T FORGET TO ATTACH THE FUNCTION TO THE APPROPRIATE BUTTON
    try {
      await api.delete(`/tasks/${id}`);
      handleFetchTasks();
    }catch (error){
      console.error("Error deleting task : ", error)
    }
  }

  const handleSave = async (task: Task) => {
    // @todo IMPLEMENT HERE : SAVE THE TASK & REFRESH ALL THE TASKS, DON'T FORGET TO ATTACH THE FUNCTION TO THE APPROPRIATE BUTTON
    const updatedName = editedTasks[task.id]; 

    if (task.name === updatedName) {
      return; 
    }
  
    try {
      await api.patch(`/tasks/${task.id}`, { name: updatedName });
      handleFetchTasks(); 
    } catch (error) {
      console.error("Error saving task: ", error);
    }
  };

    const handleEditChange = (id: number, value: string) => {
    setEditedTasks((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddTask = async () => {
    if (!newTaskName.trim()) {
      return;
    }
    try {
      await api.post('/tasks', {name: newTaskName});
      setNewTaskName("");
      handleFetchTasks();
    }catch (error){
      console.error("Error add tasks: ", error);
    }
  };

  //BONUS
  const handleChangeStatus = async (id: number, status: "to do" | "in progress" | "finished") => {
    setLoading(true);
    setLoadingStatusTaskId(id);
    try {
      const taskToUpdate = tasks.find(task => task.id === id);
  
      if (!taskToUpdate) {
        throw new Error("Task not found");
      }
  
      await api.patch(`/tasks/${id}`, { 
        name: taskToUpdate.name,  
        status 
      });
  
      handleFetchTasks();  
  
    } catch (error) {
      console.error("Error changing status: ", error);
    } finally {
      setLoading(false);
      setLoadingStatusTaskId(null); 
    }
  };
  

  useEffect(() => {
    (async () => {
      handleFetchTasks();
    })();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h2">HDM Todo List</Typography>
      </Box>

      <Box justifyContent="center" mt={5} flexDirection="column">
        {
          tasks.map((task) => (
            <Box display="flex" justifyContent="center" alignItems="center" mt={2} gap={1} width="100%">
              <TextField size="small" value={editedTasks[task.id] || task.name}  onChange={(e) => handleEditChange(task.id, e.target.value)} fullWidth sx={{ maxWidth: 350 }} />
              <Box>
                <IconButton color="success"  onClick={() => handleSave(task)} disabled={task.name === (editedTasks[task.id] || task.name)}>
                  <Check />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(task.id)}>
                  <Delete />
                </IconButton>
                {/* Bonus: */}
                <Select
                 size="small" value={task.status || 'to do'} onChange={(e) => handleChangeStatus(task.id, e.target.value as "to do" | "in progress" | "finished")} disabled={loading || loadingStatusTaskId === task.id}>
                  <MenuItem value="to do">To Do</MenuItem>
                  <MenuItem value="in progress">In Progress</MenuItem>
                  <MenuItem value="finished">Finished</MenuItem>
                </Select>
              </Box>
            </Box>
          ))
        }

        <Box display="flex" justifyContent="center" alignItems="center" mt={2} gap={2}>
        <TextField size="small" value={newTaskName}  onChange={(e) => setNewTaskName(e.target.value)} fullWidth sx={{ maxWidth: 240}} />
          <Button variant="outlined" onClick={handleAddTask}>Ajouter une tâche</Button>
        </Box>
      </Box>
    </Container>
  );
}

export default TodoPage;
