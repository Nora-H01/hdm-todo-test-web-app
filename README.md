# Frontend

## Ordre de travail des `@todo`

### 1. Suppression d'une tâche (`Delete`)
J’ai commencé par faire l’appel à l’API en utilisant la route définie dans le backend :

```typescript
await api.delete(`/tasks/${id}`);
```

Ensuite, j’ai ajouté `handleFetch()` pour rafraîchir la page et afficher les changements effectués sur les tâches.

J’ai également ajouté un `console.error` pour repérer d’éventuelles erreurs.

### 2. Sauvegarde des modifications (`handleSave`)
J’ai créé un `useState` pour permettre la mise à jour du nom des tâches modifiées :

```typescript
const [editedTasks, setEditedTasks] = useState<{ [key: number]: string }>({});
```

Ensuite, j’ai créé `updatedName`, qui récupère la modification apportée à l’état de la tâche.

- Si le nom reste identique (`===`), la tâche ne sera pas modifiée.
- Ensuite, j’ai fait appel à l’API via une requête `PATCH` pour mettre à jour le nom de la tâche :

```typescript
await api.patch(`/tasks/${taskId}`, { name: updatedName });
```

### 3. Gestion des modifications (`handleEditChange`)
Cette fonction est utilisée pour mettre à jour `setEditedTasks` avec les nouvelles valeurs entrées par l’utilisateur.

### 4. Ajout d’une nouvelle tâche (`handleAddTask`)
J’ai ajouté la possibilité d’insérer de nouvelles tâches dynamiquement.

Création d’un `useState` pour stocker le nom de la nouvelle tâche :

```typescript
const [newTaskName, setNewTaskName] = useState<string>("");
```

- Vérification que le champ ne soit pas vide avant d’envoyer la requête.
- Utilisation de `POST` pour ajouter la nouvelle tâche à la base de données :

```typescript
await api.post("/tasks", { name: newTaskName });
```

### 5. Mise à jour des éléments visuels
J’ai fait en sorte que tous les boutons et leurs événements `onClick` soient bien reliés aux nouvelles fonctions.

Exemple pour l’ajout d’une tâche :

```tsx
<input value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} />
<button onClick={handleAddTask}>Ajouter</button>
```

---

## BONUS : Gestion du statut des tâches

J’ai ajouté la gestion des statuts : `To do`, `In progress`, `Finished`.

### 1. Gestion des états avec `useState`

```typescript
const [loading, setLoading] = useState<boolean>(false);
const [loadingStatusTaskId, setLoadingStatusTaskId] = useState<number | null>(null);
```

### 2. Fonction de mise à jour du statut (`handleChangeStatus`)

- Vérifie l’`id` et le `status` de la tâche.
- Utilisation de `PATCH` pour modifier le statut dans la base de données.
- Gestion des erreurs si la tâche n’existe pas.
- Rafraîchissement avec `handleFetchTasks()` pour récupérer les modifications.

### 3. Mise à jour de l’interface utilisateur
Ajout d’un `MenuItem` avec les différents statuts disponibles.

- Mise à jour de la valeur par défaut (`To do`).
- Liaison de l’événement `onChange` :

```tsx
<select value={task.status} onChange={(e) => handleChangeStatus(task.id, e.target.value as "to do" | "in progress" | "finished")}>
  <option value="to do">To do</option>
  <option value="in progress">In progress</option>
  <option value="finished">Finished</option>
</select>
```

---

### 4. Mise à jour de `index.ts`
J’ai ajouté la gestion des statuts pour qu’ils soient bien pris en compte dans l’application.
