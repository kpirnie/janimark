/**
 * WebMCP tools for AI agents.
 * The quote tool only fills in the form. The visitor must review it and submit it themselves.
 */
(function () {
    'use strict';

    if (!('modelContext' in navigator)) {
        return;
    }

    var SERVICES = {
        'office-cleaning': 'Office & Corporate Cleaning',
        'commercial-cleaning': 'Commercial Facility Cleaning',
        'restroom-sanitization': 'Restroom Sanitization',
        'disinfection': 'Common Area & High-Touch Disinfection',
        'custom-plan': 'Custom Cleaning Plan',
        'other': 'Other'
    };

    var BUSINESS_INFO = [
        'JaniMark LLC: commercial and office cleaning',
        'Location: Agawam, MA (service-area business)',
        'Service area: Greater Springfield, MA and surrounding Western Massachusetts and northern Connecticut communities',
        'Phone: 413-374-4935',
        'Email: info@janimarkllc.com',
        'Hours: Open 24 hours, 7 days a week',
        'Services: ' + Object.keys(SERVICES).filter(function (k) { return k !== 'other'; }).map(function (k) { return SERVICES[k]; }).join(', '),
        'Free quotes: https://www.janimarkllc.com/#contact'
    ].join('\n');

    /**
     * Wrap plain text in an MCP tool result.
     *
     * @param {string} text
     * @return {object}
     */
    function result(text) {
        return { content: [{ type: 'text', text: text }] };
    }

    /**
     * Set a form field value and notify listeners.
     *
     * @param {string} id
     * @param {string} value
     * @param {number} max
     */
    function setField(id, value, max) {
        var el = document.getElementById(id);
        if (!el) {
            return;
        }
        el.value = String(value || '').trim().slice(0, max);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    var tools = [
        {
            name: 'get_business_info',
            description: 'Get JaniMark LLC contact details, hours, services and service area.',
            inputSchema: { type: 'object', properties: {} },
            annotations: { readOnlyHint: true },
            execute: async function () {
                return result(BUSINESS_INFO);
            }
        },
        {
            name: 'fill_quote_request',
            description: 'Fill in the free cleaning quote request form for the user to review. This does NOT submit the form; the user must review it and click "Request My Quote" themselves.',
            inputSchema: {
                type: 'object',
                properties: {
                    first_name: { type: 'string', maxLength: 100 },
                    last_name: { type: 'string', maxLength: 100 },
                    email: { type: 'string', format: 'email', maxLength: 254 },
                    phone: { type: 'string', maxLength: 30 },
                    service: { type: 'string', enum: Object.keys(SERVICES) },
                    message: { type: 'string', maxLength: 2000 }
                },
                required: ['first_name', 'last_name', 'email', 'phone', 'service']
            },
            execute: async function (args) {
                var form = document.getElementById('quote-form');
                if (!form) {
                    return result('The quote form is not available on this page.');
                }
                if (!args || !Object.prototype.hasOwnProperty.call(SERVICES, args.service)) {
                    return result('Invalid service. Use one of: ' + Object.keys(SERVICES).join(', '));
                }

                setField('first-name', args.first_name, 100);
                setField('last-name', args.last_name, 100);
                setField('email', args.email, 254);
                setField('phone', args.phone, 30);
                setField('service', args.service, 50);
                setField('message', args.message, 2000);

                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
                var submit = form.querySelector('.form-submit');
                if (submit) {
                    submit.focus({ preventScroll: true });
                }

                return result('The quote form has been filled in but NOT submitted. Ask the user to review the details and click "Request My Quote" to send it.');
            }
        }
    ];

    if (typeof navigator.modelContext.registerTool === 'function') {
        tools.forEach(function (tool) {
            navigator.modelContext.registerTool(tool);
        });
    } else if (typeof navigator.modelContext.provideContext === 'function') {
        navigator.modelContext.provideContext({ tools: tools });
    }
})();