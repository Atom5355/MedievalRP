scoreboard players add @a joined 0


#Your Commands Here (example)
titleraw @a[scores={joined=0}] title {"rawtext":[{"text":"§6§lWELCOME"}]}
titleraw @a[scores={joined=0}] subtitle {"rawtext":[{"text":"§e§oUSE !help FOR INFO"}]}
playsound random.levelup @a[scores={joined=0}] ~ ~ ~ 1 1 1

scoreboard players reset * joined
scoreboard players set @a joined 1
