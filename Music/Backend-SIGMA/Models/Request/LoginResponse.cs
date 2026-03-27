namespace Backend_SIGMA.Models.Request
{
    public class LoginResponse
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Correo { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string Rol { get; set; } = string.Empty;
        public int IdRol { get; set; }
    }
}