namespace Backend_SIGMA.Models.DTO
{
    public class ProveedorDTO
    {
        public int IdProveedor { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Telefono { get; set; }
        public string? Correo { get; set; }
        public int TotalMantenimientos { get; set; }
    }
}