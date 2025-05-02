function confirmDelete(taskId) {
    if (confirm('Tem certeza que deseja apagar esta tarefa?')) {
        fetch(`/delete/${taskId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                console.error('Erro ao apagar a tarefa');
            }
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
        });
    }
}
