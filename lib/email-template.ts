interface EmailTemplateProps {
  nome: string
  horario: string
}

export function buildConfirmationEmail({ nome, horario }: EmailTemplateProps) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmação de Cadastro</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#0b1220,#1e293b);padding:40px 40px 30px;text-align:center;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:48px;color:#d4b06a;letter-spacing:4px;font-weight:400;">ALPAR</h1>
              <p style="margin:12px 0 0;color:#94a3b8;font-size:16px;">Contabilidade & Gestão Empresarial</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:40px 40px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align:center;padding-bottom:24px;">
                    <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#22c55e,#16a34a);display:inline-flex;align-items:center;justify-content:center;line-height:72px;font-size:36px;">✓</div>
                  </td>
                </tr>
                <tr>
                  <td style="text-align:center;padding-bottom:8px;">
                    <h2 style="margin:0;font-size:28px;color:#0f172a;font-family:Georgia,'Times New Roman',serif;">Vaga Confirmada!</h2>
                  </td>
                </tr>
                <tr>
                  <td style="text-align:center;padding-bottom:24px;">
                    <p style="margin:0;font-size:16px;color:#475569;line-height:1.6;">Olá, <strong style="color:#0f172a;">${nome}</strong>! Sua reserva para a inauguração da Alpar foi confirmada com sucesso.</p>
                  </td>
                </tr>

                <!-- EVENT CARD -->
                <tr>
                  <td style="padding:20px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:16px;">
                          <h3 style="margin:0;font-size:18px;color:#0f172a;font-family:Georgia,'Times New Roman',serif;">📋 Informações do Evento</h3>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="30" style="vertical-align:top;font-size:18px;">📅</td>
                              <td style="font-size:15px;color:#334155;line-height:1.5;"><strong>Data:</strong> Sexta, 29 de Maio de 2026</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="30" style="vertical-align:top;font-size:18px;">🕖</td>
                              <td style="font-size:15px;color:#334155;line-height:1.5;"><strong>Seu horário:</strong> ${horario}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="30" style="vertical-align:top;font-size:18px;">📍</td>
                              <td style="font-size:15px;color:#334155;line-height:1.5;">
                                <strong>Local:</strong> Shopping Paragem<br />
                                Avenida Mário Werneck, 1360<br />
                                Estoril - BH/MG<br />
                                Estacionamento E2/G2 Sala 351
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- DIVIDER -->
                <tr>
                  <td style="padding:24px 0;">
                    <hr style="border:none;border-top:1px solid #e2e8f0;margin:0;" />
                  </td>
                </tr>

                <!-- WHAT TO EXPECT -->
                <tr>
                  <td>
                    <h3 style="margin:0 0 16px;font-size:18px;color:#0f172a;font-family:Georgia,'Times New Roman',serif;">✨ O Que Esperar</h3>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;font-size:15px;color:#334155;line-height:1.5;">
                          <strong>🎓 Pílulas de Conhecimento</strong><br />
                          <span style="color:#64748b;">Breves apresentações sobre escala de negócios, métricas de sucesso e gestão financeira.</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;font-size:15px;color:#334155;line-height:1.5;">
                          <strong>📋 Consultoria Express</strong><br />
                          <span style="color:#64748b;">Pré-análise gratuita com nossos especialistas sobre Imposto de Renda e gestão.</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;font-size:15px;color:#334155;line-height:1.5;">
                          <strong>🤝 Networking Qualificado</strong><br />
                          <span style="color:#64748b;">Coquetel para conectar você a outros empresários e fortalecer parcerias.</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;font-size:15px;color:#334155;line-height:1.5;">
                          <strong>🎧 Suporte Individualizado</strong><br />
                          <span style="color:#64748b;">Nossa equipe disponível para esclarecer dúvidas sobre os desafios do seu negócio.</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#0b1220;padding:30px 40px;text-align:center;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#d4b06a;letter-spacing:3px;">ALPAR</p>
              <p style="margin:8px 0 0;font-size:13px;color:#64748b;">
                comercial@alparcontabilidade.com.br
              </p>
              <p style="margin:4px 0 0;font-size:12px;color:#475569;">
                © 2026 Alpar Contabilidade. Todos os direitos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
