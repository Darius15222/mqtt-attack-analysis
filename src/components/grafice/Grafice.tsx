// Alege graficul interactiv după id. Se încarcă separat (vezi GraficInteractiv.tsx), pentru că ECharts e mare.
import type { IdGrafic } from '../../data/tipuri'
import ArboreDeClasificare from './ArboreDeClasificare'
import CorelatiiSpearman from './CorelatiiSpearman'
import DistributiaClaselor from './DistributiaClaselor'
import MatriceaDeConfuzie from './MatriceaDeConfuzie'
import ReguliDeAsociere from './ReguliDeAsociere'

const GRAFICE: Record<IdGrafic, () => React.ReactNode> = {
  clase: DistributiaClaselor,
  corelatii: CorelatiiSpearman,
  confuzie: MatriceaDeConfuzie,
  arbore: ArboreDeClasificare,
  reguli: ReguliDeAsociere,
}

export default function Grafice({ id }: { id: IdGrafic }) {
  const GraficAles = GRAFICE[id]
  return <GraficAles />
}
