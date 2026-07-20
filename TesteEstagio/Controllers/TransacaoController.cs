using Microsoft.AspNetCore.Mvc;
using TesteEstagio.Models;
using TesteEstagio.Services;

namespace TesteEstagio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacaoController : ControllerBase
    {
        private readonly TransacaoService _service;

        public TransacaoController(TransacaoService service)
        {
            _service = service;
        }
        
        [HttpGet("{pessoaId}")]
        public IActionResult GetTransacoes(int pessoaId)
        {
            var transacoes = _service.ListarPorPessoa(pessoaId);
            return Ok(transacoes);
        }

        [HttpGet("resumo/{pessoaId}")]
        public IActionResult GetResumo(int pessoaId)
        {
            try
            {
                var resumo = _service.ObterResumo(pessoaId);
                return Ok(resumo);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
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
