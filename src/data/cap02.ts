import type { Capitol } from './tipuri'

const date: Capitol = {
 "titlu": "2. Articole",
 "blocuri": [
  {
   "tip": "parte",
   "fel": "context",
   "titlu": "Ce facem și de ce"
  },
  {
   "tip": "text",
   "text": "Căutăm articole care au analizat tot MQTTset, ca să ne comparăm rezultatele cu ale lor (capitolul 12)."
  },
  {
   "tip": "pas",
   "fel": "decizie",
   "eticheta": "Decizie",
   "text": "cinci articole care folosesc MQTTset și citează articolul original (Vaccari et al., 2020). Toate construiesc modele care recunosc atacurile; trei (Imran et al. și cele două articole Al Hanif și Ilyas) aleg variabilele și după corelație, ca în capitolul 7. Doar Imran et al. folosește și regresia logistică; niciunul regresia liniară."
  },
  {
   "tip": "lista",
   "ordonata": true,
   "start": 1,
   "elemente": [
    "Prabhugaonkar, G.G., Sun, X., Wang, X., Dai, J. (2022). Deep IoT Monitoring: Filtering IoT Traffic Using Deep Learning. In: Silicon Valley Cybersecurity Conference (SVCC 2022), CCIS vol. 1683, Springer. https://doi.org/10.1007/978-3-031-24049-2_8",
    "Choi, S., Cho, J. (2022). Novel Feature Extraction Method for Detecting Malicious MQTT Traffic Using Seq2Seq. Applied Sciences, 12(23), 12306. https://www.mdpi.com/2076-3417/12/23/12306",
    "Imran, Zuhairi, M.F.A., Ali, S.M., Shahid, Z., Alam, M.M., Su'ud, M.M. (2023). Improving Reliability for Detecting Anomalies in the MQTT Network by Applying Correlation Analysis for Feature Selection Using Machine Learning Techniques. Applied Sciences, 13(11), 6753. https://www.mdpi.com/2076-3417/13/11/6753",
    "Al Hanif, A., Ilyas, M. (2024). Effective Feature Engineering Framework for Securing MQTT Protocol in IoT Environments. Sensors, 24(6), 1782. https://doi.org/10.3390/s24061782",
    "Al Hanif, A., Ilyas, M. (2024). Enhance the Detection of DoS and Brute Force Attacks within the MQTT Environment through Feature Engineering and Employing an Ensemble Technique. IJAIA, 15(4). https://arxiv.org/abs/2408.00480"
   ]
  }
 ]
}

export default date
