using Microsoft.AspNetCore.Mvc;
using TesteEstagio.Models;
using TesteEstagio.Services;

namespace TesteEstagio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacaoController : ControllerBase
    {
        private readonly TransacaoService _service = new();
        [HttpGet("resumo/{pessoaId}")]
        public IActionResult Get(int pessoaId)
        {
            var resumo = _service.ObterResumo(pessoaId);
            return Ok(resumo);
        }

        [HttpPost]
        public IActionResult Post(Transacao transacao)
        {
            try
            {
Transacao novaTransacao = _service.Adicionar(transacao);
            return Created("", novaTransacao);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
