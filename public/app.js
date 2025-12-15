// TUS CREDENCIALES (Asegúrate de que sean las correctas)
const SUPABASE_URL = 'https://dusuulvonleasrpbjhed.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1c3V1bHZvbmxlYXNycGJqaGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMTc4NzUsImV4cCI6MjA4MDg5Mzg3NX0.bSV9-9gqXZCtWrxGjYo_7QWxjJxtn_h312yjuEPIgn8';

// Inicializar el cliente de Supabase
const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById('resetForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorDiv = document.getElementById('error');
    const successDiv = document.getElementById('success');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');

    // Resetear mensajes
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    // Validaciones básicas
    if (password !== confirmPassword) {
        errorDiv.textContent = 'Las contraseñas no coinciden';
        errorDiv.style.display = 'block';
        return;
    }
    if (password.length < 6) {
        errorDiv.textContent = 'La contraseña debe tener al menos 6 caracteres';
        errorDiv.style.display = 'block';
        return;
    }

    // UI Loading
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';

    try {
        // La librería detecta automáticamente el "?code=" en la URL y recupera la sesión.
        // Solo tenemos que pedirle que actualice el usuario.
        const { data, error } = await _supabase.auth.updateUser({
            password: password
        });

        if (error) {
            throw error;
        }

        // Éxito
        successDiv.textContent = '¡Contraseña actualizada exitosamente!';
        successDiv.style.display = 'block';
        document.getElementById('resetForm').reset();

        setTimeout(() => {
            window.close();
        }, 3000);

    } catch (error) {
        console.error(error);
        errorDiv.textContent = error.message || 'Error al actualizar contraseña';
        errorDiv.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
});