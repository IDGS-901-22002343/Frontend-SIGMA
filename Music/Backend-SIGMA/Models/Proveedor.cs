using System.ComponentModel.DataAnnotations;

namespace Backend_SIGMA.Models
{
    public class Proveedor
    {
        [Key]
        public int IdProveedor { get; set; }

        [Required, MaxLength(100)]
        public string Nombre { get; set; }

        [MaxLength(20)]
        public string? Telefono { get; set; }

        [MaxLength(120)]
        public string? Correo { get; set; }

        public ICollection<Mantenimiento> Mantenimientos { get; set; }
    }
}