WITH market AS (
  SELECT
    34380::numeric AS china_applicants,
    0.25::numeric AS serviceable_low_share,
    0.40::numeric AS serviceable_high_share
),
unit_economics AS (
  SELECT
    999::numeric AS arppu,
    85::numeric AS variable_cost_per_payer,
    180::numeric AS cac,
    50400::numeric AS fixed_cash_cost,
    120000::numeric AS founder_labour
),
scenario_inputs (
  scenario,
  leads,
  conversion,
  arppu,
  cac,
  variable_cost_per_payer,
  fixed_cash_cost,
  founder_labour
) AS (
  VALUES
    ('Conservative', 400::numeric, 0.06::numeric, 799::numeric, 80::numeric, 68::numeric, 17400::numeric, 60000::numeric),
    ('Base', 2000::numeric, 0.125::numeric, 999::numeric, 180::numeric, 85::numeric, 50400::numeric, 120000::numeric),
    ('Optimistic', 5000::numeric, 0.15::numeric, 1199::numeric, 220::numeric, 102::numeric, 102000::numeric, 120000::numeric)
),
scenarios AS (
  SELECT
    scenario,
    leads,
    conversion,
    leads * conversion AS payers,
    arppu,
    leads * conversion * arppu AS revenue,
    leads * conversion * cac AS acquisition_cost,
    leads * conversion * variable_cost_per_payer AS variable_cost,
    leads * conversion * arppu
      - leads * conversion * cac
      - leads * conversion * variable_cost_per_payer
      - fixed_cash_cost AS cash_profit,
    leads * conversion * arppu
      - leads * conversion * cac
      - leads * conversion * variable_cost_per_payer
      - fixed_cash_cost
      - founder_labour AS economic_profit
  FROM scenario_inputs
)
SELECT
  s.*,
  m.china_applicants,
  m.china_applicants * m.serviceable_low_share AS serviceable_low,
  m.china_applicants * m.serviceable_high_share AS serviceable_high,
  u.arppu - u.variable_cost_per_payer - u.cac AS net_contribution_per_payer,
  CEIL(u.fixed_cash_cost / (u.arppu - u.variable_cost_per_payer - u.cac)) AS cash_break_even_payers,
  CEIL((u.fixed_cash_cost + u.founder_labour) / (u.arppu - u.variable_cost_per_payer - u.cac)) AS full_break_even_payers
FROM scenarios s
CROSS JOIN market m
CROSS JOIN unit_economics u
ORDER BY CASE s.scenario
  WHEN 'Conservative' THEN 1
  WHEN 'Base' THEN 2
  ELSE 3
END;
