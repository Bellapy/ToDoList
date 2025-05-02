function confirmDelete(taskId) {
    if (confirm('Tem certeza que deseja apagar esta tarefa?')) {
        fetch(`/delete/${taskId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())  // Parse do JSON
        .then(data => {
            if (data.message === 'Tarefa excluída com sucesso.') {
                alert(data.message); // Exibe uma mensagem de sucesso
                window.location.reload(); // Recarrega a página após excluir
            } else {
                console.error('Erro ao apagar a tarefa:', data.message);
            }
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
        });
    }
}