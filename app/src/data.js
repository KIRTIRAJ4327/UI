export const STAGES = ['Plan','Specify','Impact','Design','Build','Integrate','Validate','Release'];
export const GATES = { Plan:'Product Owner', Specify:'Product Owner', Design:'Solution Architect', Build:'Engineering Lead', Integrate:'Integration Lead', Validate:'Quality Lead', Release:'Release Manager' };
// state per stage: d=done a=agent working w=waiting on person f=failed ''=planned
export const RUNS = [
  { id:'WI-4821', title:'Registered Amortization limit', ws:'Full Application', owner:'Priya N.', age:'1d', s:'dddw', now:'Design · needs approval', tone:'warn' },
  { id:'WI-4807', title:'Advisor eligibility banner', ws:'Advisor Portal', owner:'Jon R.', age:'2d', s:'dddda', now:'Build · agent working', tone:'info' },
  { id:'WI-4799', title:'Statement export format', ws:'Client Services', owner:'Mara L.', age:'3d', s:'ddw', now:'Specify · 2 questions', tone:'warn' },
  { id:'WI-4790', title:'Session timeout copy', ws:'Advisor Portal', owner:'Jon R.', age:'4d', s:'ddddddf', now:'Validate · 2 tests failed', tone:'bad' },
  { id:'WI-4772', title:'Fee schedule update', ws:'Full Application', owner:'Priya N.', age:'5d', s:'dddddddd', now:'Released', tone:'ok' },
];
export const INBOX = [
  { t:'Approve solution design', sub:'Registered Amortization limit', tag:'Solution Architect gate', tone:'warn', age:'12m' },
  { t:'Answer 2 clarification questions', sub:'Does 310 apply to renewals?', tag:'Blocks Specify', tone:'warn', age:'1h' },
  { t:'Review developer completion', sub:'S-02 · Validation message copy', tag:'Engineering Lead gate', tone:'warn', age:'3h' },
  { t:'Build in progress', sub:'S-01 · Running unit tests', tag:'Agent working', tone:'info', age:'now' },
  { t:'Release complete', sub:'Advisor eligibility banner', tag:'Done', tone:'ok', age:'Tue' },
];
export const REQUEST = 'In the Full Application advisor flow, the Product Selection page must prevent advisors from entering a Registered Amortization value above the documented maximum. Registered Amortization must be less than or equal to 310.';
export const AUDIT = [
  ['Tue 14:02','Delivery plan approved','Priya N.','plan-v2.md'],
  ['Tue 16:20','Specification approved','Priya N.','spec-v3.md'],
  ['Wed 11:05','Impact assessment saved','Agent','impact-v1.md'],
  ['Wed 14:33','Design quality check passed','Agent','adr-0173.md'],
  ['Wed 14:40','Design opened for review','Alex K.','—'],
];
