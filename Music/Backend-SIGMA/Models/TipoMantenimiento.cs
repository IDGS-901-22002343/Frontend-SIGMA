using System.ComponentModel.DataAnnotations;

namespace Backend_SIGMA.Models
{
    public class TipoMantenimiento
    {
        [Key]
        public int IdTipo { get; set; }

        [Required, MaxLength(50)]
        public string Nombre { get; set; }

        [MaxLength(150)]
        public string? Descripcion { get; set; }
        public ICollection<Mantenimiento> Mantenimientos { get; set; }
    }
}