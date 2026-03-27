using Microsoft.EntityFrameworkCore;
using Backend_SIGMA.Models;
using BCrypt.Net;

namespace Backend_SIGMA.Data
{
    public class AuthData
    {
        private readonly AppDbContext _context;

        public AuthData(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Usuario?> LoginAsync(string correo, string password)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(u => u.Correo == correo && u.Estatus);

            if (usuario == null)
                return null;

            // Verificar password con BCrypt
            bool passwordValida = BCrypt.Net.BCrypt.Verify(password, usuario.PasswordHash);
            
            if (!passwordValida)
                return null;

            // Actualizar último acceso (si tienes ese campo, si no, quita esto)
            // usuario.UltimoAcceso = DateTime.Now;
            await _context.SaveChangesAsync();

            return usuario;
        }

        public async Task<Usuario> RegistroAsync(Usuario usuario, string password)
        {
            // Hashear password
            usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
            
            // Si no se especifica rol, asignar rol por defecto (ej: 2 = Usuario)
            if (usuario.IdRol == 0)
                usuario.IdRol = 2; // Ajusta según tus roles

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            // Cargar la relación del rol
            await _context.Entry(usuario)
                .Reference(u => u.Rol)
                .LoadAsync();

            return usuario;
        }

        public async Task<bool> ExisteCorreo(string correo)
        {
            return await _context.Usuarios.AnyAsync(u => u.Correo == correo);
        }
    }
}