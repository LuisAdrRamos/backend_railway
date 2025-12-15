// --- 1. CONFIGURACIÓN ---
// TUS CREDENCIALES (Asegúrate de que sean las correctas del .env)
const SUPABASE_URL = 'https://dusuulvonleasrpbjhed.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1c3V1bHZvbmxlYXNycGJqaGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMTc4NzUsImV4cCI6MjA4MDg5Mzg3NX0.bSV9-9gqXZCtWrxGjYo_7QWxjJxtn_h312yjuEPIgn8';

// Inicializar cliente
const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 2. LÓGICA DE INICIO (Canjear Código) ---
document.addEventListener('DOMContentLoaded', async () => {
    // Buscar el código en la URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
        // Si hay código, lo canjeamos por una sesión
        const { data, error } = await _supabase.auth.exchangeCodeForSession(code);

        if (error) {
            const errorDiv = document.getElementById('error');
            errorDiv.textContent = 'El enlace ha expirado o es inválido: ' + error.message;
            errorDiv.style.display = 'block';
        } else {
            console.log("Sesión recuperada exitosamente");
        }
    }
});

// --- 3. LÓGICA DEL FORMULARIO ---
document.getElementById('resetForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorDiv = document.getElementById('error');
    const successDiv = document.getElementById('success');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');

    // Limpiar mensajes
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    // Validaciones
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

    // Mostrar carga
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';

    try {
        // Verificar sesión antes de actualizar
        const { data: { session } } = await _supabase.auth.getSession();

        if (!session) {
            throw new Error("No hay sesión activa. El código puede haber expirado. Solicita un nuevo correo.");
        }

        // Actualizar contraseña
        const { data, error } = await _supabase.auth.updateUser({
            password: password
        });

        if (error) throw error;

        // Éxito
        successDiv.textContent = '¡Contraseña actualizada exitosamente!';
        successDiv.style.display = 'block';
        document.getElementById('resetForm').reset();

        // Cerrar pestaña después de 3 segundos
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