using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend_SIGMA.Models
{
    public class Rol
    {
        [Key]
        public int IdRol { get; set; }

        [Required, MaxLength(50)]
        public string Nombre { get; set; }

        [MaxLength(150)]
        public string? Descripcion { get; set; }

        public ICollection<Usuario> Usuarios { get; set; }
    }
}