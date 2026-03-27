namespace Backend_SIGMA.Models.DTO
{
    public class UsuarioSimpleDTO
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Correo { get; set; } = string.Empty;
        public string? RolNombre { get; set; }
    }
}