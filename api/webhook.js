const Stripe = require('stripe');
const { Resend } = require('resend');
const { matchProtocol } = require('./lib/protocols');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

// Disable body parsing for webhook signature verification
module.exports.config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function generateEmailHTML(protocol, customerEmail, tier) {
  const phases = protocol.phases.map((phase, i) => `
    <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #00d4ff;">
      <div style="background: #00d4ff; color: #1a1a2e; padding: 6px 16px; border-radius: 50px; display: inline-block; font-weight: 700; font-size: 14px; margin-bottom: 15px;">
        PHASE ${phase.number}: Weeks ${phase.weeks}
      </div>
      <h3 style="color: #1a1a2e; margin: 0 0 15px 0; font-size: 24px;">${phase.peptide.name}</h3>
      <p style="color: #666; margin: 0 0 20px 0;">${phase.peptide.description}</p>

      <table style="width: 100%; background: white; border-radius: 8px; overflow: hidden;">
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 12px; font-weight: 600; color: #1a1a2e; width: 30%;">Dosage</td>
          <td style="padding: 12px; color: #444;">${phase.peptide.dosage}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 12px; font-weight: 600; color: #1a1a2e;">Route</td>
          <td style="padding: 12px; color: #444;">${phase.peptide.route}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 12px; font-weight: 600; color: #1a1a2e;">Timing</td>
          <td style="padding: 12px; color: #444;">${phase.peptide.timing}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: 600; color: #1a1a2e;">Frequency</td>
          <td style="padding: 12px; color: #444;">${phase.peptide.frequency}</td>
        </tr>
      </table>

      <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin-top: 15px;">
        <strong style="color: #0096c7;">Why this peptide:</strong>
        <span style="color: #444;"> ${phase.purpose}</span>
      </div>
    </div>
  `).join('');

  const adjustments = protocol.adjustments.length > 0 ? `
    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #ffc107;">
      <strong style="color: #856404;">Personalized Adjustments:</strong>
      <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #856404;">
        ${protocol.adjustments.map(a => `<li style="margin: 5px 0;">${a}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  const warnings = protocol.warnings.length > 0 ? `
    <div style="background: #f8d7da; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #dc3545;">
      <strong style="color: #721c24;">Important Warnings:</strong>
      <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #721c24;">
        ${protocol.warnings.map(w => `<li style="margin: 5px 0;">${w}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 700px; margin: 0 auto; padding: 20px;">

  <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 40px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
    <h1 style="margin: 0 0 10px 0; font-size: 28px;">Your Personalized Protocol</h1>
    <p style="margin: 0; opacity: 0.9; font-size: 18px;">${protocol.name}</p>
    <p style="margin: 10px 0 0 0; opacity: 0.8;">${protocol.totalWeeks} Week Timeline • ${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan</p>
  </div>

  <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
    <strong style="color: #856404;">⚠️ Medical Disclaimer</strong>
    <p style="color: #856404; margin: 10px 0 0 0; font-size: 14px;">
      This protocol is for educational purposes only and is not medical advice. Always consult with a qualified healthcare provider before starting any peptide protocol. Individual results may vary. Do not use if you have contraindicated conditions.
    </p>
  </div>

  ${warnings}
  ${adjustments}

  <h2 style="color: #1a1a2e; border-bottom: 2px solid #00d4ff; padding-bottom: 10px;">Your Protocol Phases</h2>

  ${phases}

  <div style="background: white; border: 2px solid #00d4ff; padding: 25px; border-radius: 12px; margin-top: 30px;">
    <h3 style="color: #1a1a2e; margin: 0 0 20px 0;">📋 Implementation Guidelines</h3>
    <ul style="margin: 0; padding-left: 20px; color: #444;">
      <li style="margin: 10px 0;"><strong>Storage:</strong> Keep all reconstituted peptides refrigerated at 2-8°C. Never freeze.</li>
      <li style="margin: 10px 0;"><strong>Reconstitution:</strong> Use bacteriostatic water. Inject slowly down vial side.</li>
      <li style="margin: 10px 0;"><strong>Injection Sites:</strong> Rotate between abdomen, thighs, arms. Keep a log.</li>
      <li style="margin: 10px 0;"><strong>Monitoring:</strong> Track weekly: energy, recovery, sleep, any side effects.</li>
      <li style="margin: 10px 0;"><strong>Blood Work:</strong> Consider baseline labs and mid-protocol check (week 10-12).</li>
      <li style="margin: 10px 0;"><strong>Red Flags:</strong> Stop immediately if: severe injection reactions, persistent headaches, vision changes, unusual swelling.</li>
      <li style="margin: 10px 0;"><strong>Source Quality:</strong> Only purchase from reputable suppliers with third-party testing.</li>
    </ul>
  </div>

  <div style="text-align: center; margin-top: 40px; padding: 30px; background: #f8f9fa; border-radius: 12px;">
    <h3 style="color: #1a1a2e; margin: 0 0 15px 0;">Questions About Your Protocol?</h3>
    <p style="color: #666; margin: 0;">Reply to this email or contact us at support@peptidestack.com</p>
  </div>

  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
    <p style="color: #999; font-size: 12px; margin: 0;">
      © ${new Date().getFullYear()} PeptideStack. All rights reserved.<br>
      This email was sent to ${customerEmail}
    </p>
  </div>

</body>
</html>
  `;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const { tier, answers } = {
        tier: session.metadata.tier,
        answers: JSON.parse(session.metadata.answers || '{}'),
      };

      const customerEmail = session.customer_email;
      const protocol = matchProtocol(answers);
      const emailHTML = generateEmailHTML(protocol, customerEmail, tier);

      // Send email via Resend
      await resend.emails.send({
        from: 'PeptideStack <protocols@peptidestack.com>',
        to: customerEmail,
        subject: `Your ${protocol.name} Protocol is Ready`,
        html: emailHTML,
      });

      console.log(`Protocol sent to ${customerEmail}`);
    } catch (error) {
      console.error('Error processing order:', error);
      // Don't return error to Stripe, just log it
    }
  }

  return res.status(200).json({ received: true });
};
