using Microsoft.EntityFrameworkCore;
using Backend_SIGMA.Models;

namespace Backend_SIGMA.Data
{
    public class UsuariosData
    {
        private readonly AppDbContext _context;

        public UsuariosData(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Usuario>> GetAllAsync()
        {
            return await _context.Usuarios
                .Include(u => u.Rol)
                .ToListAsync();
        }

        public async Task<Usuario?> GetByIdAsync(int id)
        {
            return await _context.Usuarios
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(u => u.IdUsuario == id);
        }

        public async Task<Usuario?> UpdateAsync(Usuario usuario)
        {
            _context.Usuarios.Update(usuario);
            await _context.SaveChangesAsync();
            return usuario;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
                return false;

            // Soft delete (cambiar estatus en lugar de eliminar)
            usuario.Estatus = false;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CambiarRolAsync(int idUsuario, int idRol)
        {
            var usuario = await _context.Usuarios.FindAsync(idUsuario);
            if (usuario == null)
                return false;

            usuario.IdRol = idRol;
            await _context.SaveChangesAsync();
            return true;
        }

        // GET CONDUCTORES (rol ID = 3)
        public async Task<List<Usuario>> GetConductoresAsync()
        {
            return await _context.Usuarios
                .Include(u => u.Rol)
                .Where(u => u.IdRol == 3 && u.Estatus)
                .OrderBy(u => u.Nombre)
                .ToListAsync();
        }

        // GET BY ROL
        public async Task<List<Usuario>> GetByRolAsync(int rolId)
        {
            return await _context.Usuarios
                .Include(u => u.Rol)
                .Where(u => u.IdRol == rolId && u.Estatus)
                .ToListAsync();
        }
    }
}