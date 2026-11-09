# Cap. 10: arborii de decizie cu partykit::ctree (test statistic + Bonferroni la fiecare nod).
# Rulare: Rscript 09_cap10_arbori_ctree.R ../mqttdataset_reduced.csv.zip folder_grafice
suppressMessages(library(partykit))
a <- commandArgs(TRUE)
d <- read.csv(unz(a[1], "mqttdataset_reduced.csv"), check.names = FALSE,
              colClasses = c(tcp.flags = "character", mqtt.conack.flags = "character",
                             mqtt.conflags = "character", mqtt.hdrflags = "character"))  # hex: text, nu număr
names(d) <- make.names(names(d))
for (v in c(names(d)[sapply(d, is.character)], "mqtt.msgtype", "mqtt.dupflag", "mqtt.ver")) d[[v]] <- factor(d[[v]])
options(digits = 10)  # pragurile din print, nerotunjite
d$is_attack <- factor(ifelse(d$target == "legitimate", "normal", "atac"), c("normal", "atac"))

# 70/30, separat pe fiecare clasă (aceleași proporții în ambele părți)
set.seed(42)
tr <- logical(nrow(d))
for (cl in levels(d$target)) { i <- which(d$target == cl); tr[sample(i, round(0.7 * length(i)))] <- TRUE }
D <- d[tr, ]; Te <- d[!tr, ]
cat("constructie", nrow(D), "test", nrow(Te), "\n"); print(table(D$target)); print(table(D$is_attack))

ctl <- function(md, tt = "Bonferroni") ctree_control(teststat = "quadratic", testtype = tt, mincriterion = 0.95,
                                                     minsplit = 20, minbucket = 300, maxdepth = md)
X7 <- c("tcp.flags", "mqtt.msgtype", "tcp.len", "tcp.time_delta", "mqtt.qos", "mqtt.dupflag", "mqtt.ver")
f_cls <- reformulate(X7, "is_attack")
f_reg <- tcp.len ~ target + tcp.flags + mqtt.msgtype + tcp.time_delta

met <- function(y, p) { tp <- sum(p == "atac" & y == "atac"); fp <- sum(p == "atac" & y == "normal")
  fn <- sum(p == "normal" & y == "atac"); s <- tp / (tp + fn); pr <- tp / (tp + fp)
  round(c(acc = mean(p == y), sens = s, prec = pr, f1 = 2 * s * pr / (s + pr)), 4) }
reg <- function(y, p) round(c(MAE = mean(abs(y - p)), RMSE = sqrt(mean((y - p)^2)),
                              R2 = 1 - sum((y - p)^2) / sum((y - mean(y))^2)), 4)

out <- if (is.na(a[2])) NULL else { dir.create(a[2], showWarnings = FALSE); a[2] }
salv <- function(x, f) { print(x); if (!is.null(out)) write.csv(x, file.path(out, f), row.names = FALSE) }

cat("\n10.3 maxdepth, clasificare\n")
salv(do.call(rbind, lapply(2:6, function(md) { m <- ctree(f_cls, D, control = ctl(md))
  data.frame(maxdepth = md, frunze = width(m), t(met(D$is_attack, predict(m))[c(1, 4)]), t(met(Te$is_attack, predict(m, Te))[c(1, 4)])) })),
  "adancime_clasificare.csv")  # coloane: acc, f1 constructie; acc.1, f1.1 test
cat("\n10.3 maxdepth, regresie\n")
salv(do.call(rbind, lapply(2:6, function(md) { m <- ctree(f_reg, D, control = ctl(md))
  data.frame(maxdepth = md, frunze = width(m), R2_constr = reg(D$tcp.len, predict(m))[[3]], t(reg(Te$tcp.len, predict(m, Te)))) })),
  "adancime_regresie.csv")

m <- ctree(f_cls, D, control = ctl(5))
cat("\n10.4 arborele de clasificare\n"); print(m)
cat("aceleasi predictii la maxdepth 6:", identical(predict(m, Te), predict(ctree(f_cls, D, control = ctl(6)), Te)), "\n")

cat("\n10.1 radacina: statistica, df, log10 p, log10 p*7\n")
st <- info_node(node_party(m))$criterion["statistic", ]
df <- sapply(X7, function(v) if (is.factor(D[[v]])) nlevels(droplevels(D[[v]])) - 1 else 1)
lp <- pchisq(st, df, lower.tail = FALSE, log.p = TRUE) / log(10)
print(round(cbind(T = st, df = df, log10p = lp, log10p7 = lp + log10(7))[order(lp), ], 2))
q <- table(D$mqtt.qos > 0, D$is_attack); E <- outer(rowSums(q), colSums(q)) / sum(q)
cat("tabel qos: O\n"); print(q); cat("E\n"); print(round(E, 1)); cat("chi2", sum((q - E)^2 / E), " (n-1) r2", (nrow(D) - 1) * cor(D$mqtt.qos, as.numeric(D$is_attack))^2, " r", cor(D$mqtt.qos, as.numeric(D$is_attack)), "\n")

mu <- ctree(f_cls, D, control = ctl(5, "Univariate"))
cat("\nfara Bonferroni: frunze", width(mu), " aceleasi predictii pe test:", identical(predict(mu, Te), predict(m, Te)), "\n")

cat("\nfrunze: id | regula | n | % atac | prezice | clase\n")
fn <- predict(m, type = "node"); rl <- partykit:::.list.rules.party(m)
for (id in sort(unique(fn))) { i <- fn == id; k <- sort(table(D$target[i]), decreasing = TRUE); k <- k[k > 0]
  cat(id, "|", rl[as.character(id)], "|", sum(i), "|", round(100 * mean(D$is_attack[i] == "atac"), 2), "|",
      as.character(predict(m, D[which(i)[1], ])), "|", paste(names(k), k, collapse = "; "), "\n") }

p <- predict(m, Te)
cat("\n10.5 test\n"); print(table(real = Te$is_attack, prezis = p))
cat("test", met(Te$is_attack, p), "\nconstructie", met(D$is_attack, predict(m)), "\n")
print(t(sapply(split(p != Te$is_attack, Te$target), function(x) c(n = length(x), gresite = sum(x)))))
ratate <- Te$is_attack == "atac" & p == "normal"
cat("atacuri ratate pe frunze:\n"); print(table(predict(m, Te[ratate, ], type = "node")))

cat("\nverificari 10.2 / 10.4\n")
X19 <- setdiff(names(d)[sapply(d, function(x) length(unique(x)) > 1)], c("target", "is_attack", "mqtt.msg", "mqtt.msgid"))
m19 <- ctree(reformulate(X19, "is_attack"), D, control = ctl(5))
cat(length(X19), "variabile: F1 test", met(Te$is_attack, predict(m19, Te))[4], " radacina:", names(m19$data)[split_node(node_party(m19))$varid], "\n")
D$len3 <- cut(D$tcp.len, c(-1, 0, 20, Inf)); Te$len3 <- cut(Te$tcp.len, c(-1, 0, 20, Inf))
mb <- ctree(reformulate(c(setdiff(X7, "tcp.len"), "len3"), "is_attack"), D, control = ctl(5))
cat("tcp.len in 0 / 1-20 / 21+: F1 test", met(Te$is_attack, predict(mb, Te))[4], "\n")

r <- ctree(f_reg, D, control = ctl(4))
cat("\n10.6 arborele de regresie\n"); print(r)
pr <- predict(r, Te); e <- Te$tcp.len - pr
cat("constructie", reg(D$tcp.len, predict(r)), "\ntest", reg(Te$tcp.len, pr), "\n")
cat("suma |e|", sum(abs(e)), " SSE", sum(e^2), " SST", sum((Te$tcp.len - mean(Te$tcp.len))^2), "\n")
cat("cota SSE pe clase:\n"); print(round(tapply(e^2, Te$target, sum) / sum(e^2), 4))
rn <- predict(r, type = "node")
cat("frunze regresie: id | n | media | mediana | clase\n")
for (id in sort(unique(rn))) { i <- rn == id; k <- table(droplevels(D$target[i]))
  cat(id, "|", sum(i), "|", round(mean(D$tcp.len[i]), 1), "|", median(D$tcp.len[i]), "|", paste(names(k), k, collapse = "; "), "\n") }

cat("\ncomparatie cu regresia liniara (R2 test: dreapta, arbore)\n")
for (f in list(mqtt.len ~ tcp.len, tcp.time_delta ~ tcp.len + mqtt.len)) {
  l <- lm(f, D); t <- ctree(f, D, control = ctl(4)); y <- Te[[all.vars(f)[1]]]
  cat(deparse(f), reg(y, predict(l, Te))[3], reg(y, predict(t, Te))[3], "\n") }

# nodurile, pentru desene (10_grafice_arbori.py): id, copii, variabila, p ajustat, etichetele ramurilor, frunze
noduri <- function(t, y) {
  fn <- predict(t, type = "node")
  do.call(rbind, lapply(nodeids(t), function(id) { nd <- nodeapply(t, id, identity)[[1]]; sp <- split_node(nd)  # id-urile din arborele întreg
    v <- y[fn %in% nodeids(t, id, terminal = TRUE)]
    r <- data.frame(id = id, copii = "", var = "", p = NA, ramuri = "", n = length(v))
    if (!is.null(sp)) { r$copii <- paste(sapply(kids_node(nd), id_node), collapse = ";"); r$var <- names(t$data)[sp$varid]
      r$p <- info_node(nd)$p.value; r$ramuri <- paste(character_split(sp, t$data, digits = 6)$levels, collapse = "|") }
    cbind(r, if (is.factor(y)) t(as.matrix(table(v))) else t(c(quantile(v, c(0, .25, .5, .75, 1)), media = mean(v)))) }))
}
if (!is.null(out)) {
  write.csv(noduri(m, D$target), file.path(out, "noduri_clasificare.csv"), row.names = FALSE)
  write.csv(noduri(r, D$tcp.len), file.path(out, "noduri_regresie.csv"), row.names = FALSE)
}
