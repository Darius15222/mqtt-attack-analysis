# =============================================================================
# Cap. 10: arborii de decizie cu partykit::ctree
#
# Reproduce cifrele din cap. 10: alegerea adâncimii (10.3), tabelul testelor
# din rădăcină (10.1), arborele de clasificare și frunzele lui (10.4),
# metricile (10.5), verificările din 10.2 / 10.4 și arborele de
# regresie pentru tcp.len (10.6).
#
# ctree alege la fiecare nod variabila cu cel mai mic p al unui test de
# independență și desparte nodul doar dacă acest p, corectat Bonferroni,
# este sub 0,05. Așa arborele se oprește singur, fără tăiere ulterioară.
#
# Arborii se construiesc pe toate cele 330.926 de pachete, iar metricile se
# calculează pe aceleași pachete (fără împărțire în construcție și test).
#
# Intrări:
#   1. arhiva zip cu mqttdataset_reduced.csv
#   2. (opțional) folderul de ieșire pentru CSV-uri
# Ieșiri:
#   la ecran: toate rezultatele;
#   în folder: adancime_clasificare.csv, adancime_regresie.csv (10.3) și
#   noduri_clasificare.csv, noduri_regresie.csv (pentru 10_grafice_arbori.py).
#
# Rulare (durează câteva minute; are nevoie de r-base și r-cran-partykit):
#   Rscript 09_cap10_arbori_ctree.R ../mqttdataset_reduced.csv.zip folder_grafice
# =============================================================================

suppressMessages(library(partykit))
argumente <- commandArgs(TRUE)


# ---- Citirea datelor --------------------------------------------------------

# Coloanele hex se citesc ca text: altfel R le transformă în numere,
# iar „0” și „0x00000000” ar deveni aceeași valoare.
d <- read.csv(unz(argumente[1], "mqttdataset_reduced.csv"), check.names = FALSE,
              colClasses = c(tcp.flags = "character", mqtt.conack.flags = "character",
                             mqtt.conflags = "character", mqtt.hdrflags = "character"))
names(d) <- make.names(names(d))

# Textul și codurile (tipul mesajului, dupflag, versiunea) sunt categorii, nu numere.
for (v in c(names(d)[sapply(d, is.character)], "mqtt.msgtype", "mqtt.dupflag", "mqtt.ver")) {
  d[[v]] <- factor(d[[v]])
}
options(digits = 10)  # pragurile din print, nerotunjite
d$is_attack <- factor(ifelse(d$target == "legitimate", "normal", "atac"), c("normal", "atac"))
cat("pachete", nrow(d), "\n")
print(table(d$is_attack))


# ---- Setările arborilor și metricile ----------------------------------------

# quadratic + Bonferroni: testul chi-pătrat al fiecărei variabile, cu p înmulțit
#   cu numărul de variabile testate (altfel, cu 7 variabile, una ar ieși
#   „semnificativă” din întâmplare mult mai des de 5% din cazuri);
# mincriterion 0,95: se desparte doar dacă 1 - p ajustat > 0,95;
# minbucket 300: fiecare frunză are măcar 300 de pachete, ca să nu apară
#   frunze pentru câteva pachete izolate (cu 330.926 de rânduri, aproape orice
#   despărțire ar fi „semnificativă”).
setari <- function(maxdepth, testtype = "Bonferroni") {
  ctree_control(teststat = "quadratic", testtype = testtype, mincriterion = 0.95,
                minsplit = 20, minbucket = 300, maxdepth = maxdepth)
}
X7 <- c("tcp.flags", "mqtt.msgtype", "tcp.len", "tcp.time_delta", "mqtt.qos", "mqtt.dupflag", "mqtt.ver")
formula_clasificare <- reformulate(X7, "is_attack")
formula_regresie <- tcp.len ~ target + tcp.flags + mqtt.msgtype + tcp.time_delta

# acuratețe, sensibilitate, precizie, F1; clasa pozitivă este „atac”
metrici_clasificare <- function(real, prezis) {
  tp <- sum(prezis == "atac" & real == "atac")
  fp <- sum(prezis == "atac" & real == "normal")
  fn <- sum(prezis == "normal" & real == "atac")
  sensibilitate <- tp / (tp + fn)
  precizie <- tp / (tp + fp)
  round(c(acc = mean(prezis == real), sens = sensibilitate, prec = precizie,
          f1 = 2 * sensibilitate * precizie / (sensibilitate + precizie)), 4)
}
metrici_regresie <- function(real, prezis) {
  round(c(MAE = mean(abs(real - prezis)), RMSE = sqrt(mean((real - prezis)^2)),
          R2 = 1 - sum((real - prezis)^2) / sum((real - mean(real))^2)), 4)
}

folder_iesire <- if (is.na(argumente[2])) NULL else {
  dir.create(argumente[2], showWarnings = FALSE)
  argumente[2]
}
afiseaza_si_salveaza <- function(tabel, fisier) {
  print(tabel)
  if (!is.null(folder_iesire)) write.csv(tabel, file.path(folder_iesire, fisier), row.names = FALSE)
}


# ---- 10.3 Alegerea adâncimii maxime -----------------------------------------

cat("\n10.3 maxdepth, clasificare\n")
afiseaza_si_salveaza(do.call(rbind, lapply(2:6, function(md) {
  arbore <- ctree(formula_clasificare, d, control = setari(md))
  data.frame(maxdepth = md, frunze = width(arbore), t(metrici_clasificare(d$is_attack, predict(arbore))[c(1, 4)]))
})), "adancime_clasificare.csv")

cat("\n10.3 maxdepth, regresie\n")
afiseaza_si_salveaza(do.call(rbind, lapply(2:6, function(md) {
  arbore <- ctree(formula_regresie, d, control = setari(md))
  data.frame(maxdepth = md, frunze = width(arbore), t(metrici_regresie(d$tcp.len, predict(arbore))))
})), "adancime_regresie.csv")


# ---- 10.4 Arborele de clasificare (maxdepth 5) ------------------------------

m <- ctree(formula_clasificare, d, control = setari(5))
cat("\n10.4 arborele de clasificare\n")
print(m)
# unname: predict() pune ca nume numerele nodurilor, care diferă între cei doi arbori
cat("aceleasi predictii la maxdepth 6:",
    identical(unname(predict(m)), unname(predict(ctree(formula_clasificare, d, control = setari(6))))), "\n")


# ---- 10.1 Testele din rădăcină ----------------------------------------------

# Statistica fiecărei variabile în rădăcină, cu p recalculat din chi-pătrat;
# log10p7 = p înmulțit cu 7 (corecția Bonferroni pentru cele 7 variabile).
cat("\n10.1 radacina: statistica, df, log10 p, log10 p*7\n")
statistici <- info_node(node_party(m))$criterion["statistic", ]
grade_libertate <- sapply(X7, function(v) if (is.factor(d[[v]])) nlevels(droplevels(d[[v]])) - 1 else 1)
log10_p <- pchisq(statistici, grade_libertate, lower.tail = FALSE, log.p = TRUE) / log(10)
print(round(cbind(T = statistici, df = grade_libertate, log10p = log10_p, log10p7 = log10_p + log10(7))[order(log10_p), ], 2))

# Verificare de mână pentru mqtt.qos: statistica este chi-pătrat pe tabelul 2x2
# (qos > 0 față de atac), adică (n - 1) * r².
q <- table(d$mqtt.qos > 0, d$is_attack)
E <- outer(rowSums(q), colSums(q)) / sum(q)
cat("tabel qos: O\n")
print(q)
cat("E\n")
print(round(E, 1))
cat("chi2", sum((q - E)^2 / E),
    " (n-1) r2", (nrow(d) - 1) * cor(d$mqtt.qos, as.numeric(d$is_attack))^2,
    " r", cor(d$mqtt.qos, as.numeric(d$is_attack)), "\n")

# Același arbore fără corecția Bonferroni
fara_bonferroni <- ctree(formula_clasificare, d, control = setari(5, "Univariate"))
cat("\nfara Bonferroni: frunze", width(fara_bonferroni),
    " aceleasi predictii:", identical(predict(fara_bonferroni), predict(m)), "\n")
# cel mai mare p ajustat dintr-o despărțire, cu numărul de predictori testați acolo
for (id in nodeids(m)) {
  nod <- nodeapply(m, id, identity)[[1]]
  if (!is.null(split_node(nod))) {
    cr <- info_node(nod)$criterion
    cat("nod", id, "p ajustat", info_node(nod)$p.value, " p minim", min(exp(cr["p.value", ]), na.rm = TRUE),
        " predictori testati", sum(!is.na(cr["p.value", ])), "\n")
  }
}


# ---- 10.4 Frunzele arborelui de clasificare ---------------------------------

cat("\nfrunze: id | regula | n | % atac | prezice | clase\n")
frunza <- predict(m, type = "node")
reguli <- partykit:::.list.rules.party(m)
for (id in sort(unique(frunza))) {
  in_frunza <- frunza == id
  clase <- sort(table(d$target[in_frunza]), decreasing = TRUE)
  clase <- clase[clase > 0]
  cat(id, "|", reguli[as.character(id)], "|", sum(in_frunza), "|",
      round(100 * mean(d$is_attack[in_frunza] == "atac"), 2), "|",
      as.character(predict(m, d[which(in_frunza)[1], ])), "|",
      paste(names(clase), clase, collapse = "; "), "\n")
}


# ---- 10.5 Evaluarea ---------------------------------------------------------

prezis <- predict(m)
cat("\n10.5 evaluare\n")
print(table(real = d$is_attack, prezis = prezis))
cat(metrici_clasificare(d$is_attack, prezis), "\n")
print(t(sapply(split(prezis != d$is_attack, d$target), function(x) c(n = length(x), gresite = sum(x)))))
ratate <- d$is_attack == "atac" & prezis == "normal"
cat("atacuri ratate pe frunze:\n")
print(table(frunza[ratate]))


# ---- Verificări 10.2 / 10.4 -------------------------------------------------

cat("\nverificari 10.2 / 10.4\n")
# Toate variabilele care nu sunt constante (fără clasă, conținutul mesajului și id-ul lui)
X19 <- setdiff(names(d)[sapply(d, function(x) length(unique(x)) > 1)],
               c("target", "is_attack", "mqtt.msg", "mqtt.msgid"))
m19 <- ctree(reformulate(X19, "is_attack"), d, control = setari(5))
cat(length(X19), "variabile: F1", metrici_clasificare(d$is_attack, predict(m19))[4],
    " radacina:", names(m19$data)[split_node(node_party(m19))$varid], "\n")

# tcp.len grupat în 3 intervale în loc de valoarea exactă
d$len3 <- cut(d$tcp.len, c(-1, 0, 20, Inf))
m_len3 <- ctree(reformulate(c(setdiff(X7, "tcp.len"), "len3"), "is_attack"), d, control = setari(5))
cat("tcp.len in 0 / 1-20 / 21+: F1", metrici_clasificare(d$is_attack, predict(m_len3))[4], "\n")

# Arborele construit pe 70% din pachete, verificat pe celelalte 30% (pachete nevăzute)
set.seed(1)
antrenare <- sample(nrow(d), round(0.7 * nrow(d)))
m70 <- ctree(formula_clasificare, d[antrenare, ], control = setari(5))
cat("construit pe 70%, F1 pe restul de 30%:",
    metrici_clasificare(d$is_attack[-antrenare], predict(m70, newdata = d[-antrenare, ]))[4], "\n")


# ---- 10.6 Arborele de regresie pentru tcp.len (maxdepth 4) ------------------

r <- ctree(formula_regresie, d, control = setari(4))
cat("\n10.6 arborele de regresie\n")
print(r)
eroare <- d$tcp.len - predict(r)
cat(metrici_regresie(d$tcp.len, predict(r)), "\n")
cat("suma |e|", sum(abs(eroare)), " SSE", sum(eroare^2), " SST", sum((d$tcp.len - mean(d$tcp.len))^2), "\n")
cat("cota SSE pe clase:\n")
print(round(tapply(eroare^2, d$target, sum) / sum(eroare^2), 4))

frunza_reg <- predict(r, type = "node")
cat("frunze regresie: id | n | media | mediana | clase\n")
for (id in sort(unique(frunza_reg))) {
  in_frunza <- frunza_reg == id
  clase <- table(droplevels(d$target[in_frunza]))
  cat(id, "|", sum(in_frunza), "|", round(mean(d$tcp.len[in_frunza]), 1), "|",
      median(d$tcp.len[in_frunza]), "|", paste(names(clase), clase, collapse = "; "), "\n")
}

cat("\ncomparatie cu regresia liniara (R2: dreapta, arbore)\n")
for (f in list(mqtt.len ~ tcp.len, tcp.time_delta ~ tcp.len + mqtt.len)) {
  real <- d[[all.vars(f)[1]]]
  cat(deparse(f), metrici_regresie(real, fitted(lm(f, d)))[3],
      metrici_regresie(real, predict(ctree(f, d, control = setari(4))))[3], "\n")
}


# ---- Tabelul nodurilor, pentru desene (10_grafice_arbori.py) ----------------

# Un rând pentru fiecare nod: id, copii (id-uri separate prin „;”), variabila
# despărțirii, p ajustat, etichetele ramurilor (separate prin „|”), n și
# conținutul nodului: numărul de pachete din fiecare clasă (clasificare) sau
# cuantilele și media lui tcp.len (regresie).
# Nodurile interne nu au rândurile lor în predict(type = "node"), așa că
# se adună frunzele de sub ele.
noduri <- function(arbore, y) {
  frunza <- predict(arbore, type = "node")
  do.call(rbind, lapply(nodeids(arbore), function(id) {
    nod <- nodeapply(arbore, id, identity)[[1]]  # id-urile din arborele întreg
    despartire <- split_node(nod)
    valori <- y[frunza %in% nodeids(arbore, id, terminal = TRUE)]
    rand <- data.frame(id = id, copii = "", var = "", p = NA, ramuri = "", n = length(valori))
    if (!is.null(despartire)) {
      rand$copii <- paste(sapply(kids_node(nod), id_node), collapse = ";")
      rand$var <- names(arbore$data)[despartire$varid]
      rand$p <- info_node(nod)$p.value
      rand$ramuri <- paste(character_split(despartire, arbore$data, digits = 6)$levels, collapse = "|")
    }
    continut <- if (is.factor(y)) t(as.matrix(table(valori))) else
      t(c(quantile(valori, c(0, .25, .5, .75, 1)), media = mean(valori)))
    cbind(rand, continut)
  }))
}
if (!is.null(folder_iesire)) {
  write.csv(noduri(m, d$target), file.path(folder_iesire, "noduri_clasificare.csv"), row.names = FALSE)
  write.csv(noduri(r, d$tcp.len), file.path(folder_iesire, "noduri_regresie.csv"), row.names = FALSE)
}
