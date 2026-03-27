using System.ComponentModel.DataAnnotations;

namespace Backend_SIGMA.Models.Request
{
    public class UsuarioUpdateRequest
    {
        public string? Nombre { get; set; }
        
        [EmailAddress]
        public string? Correo { get; set; }
        
        public string? Telefono { get; set; }
        
        [MinLength(6)]
        public string? Password { get; set; }
        
        public int? IdRol { get; set; }
        public bool? Estatus { get; set; }
    }
}