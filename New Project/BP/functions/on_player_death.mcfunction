scoreboard players set @a [scores={alive=!2}] alive 0
scoreboard players set @e [type=player] alive 1


#Your Commands Here (example)
execute as @a [scores={alive=0}] run title @s title §l§4You Died! 
execute as @a [scores={alive=0}] run title @s subtitle §l§6SPAWNED AT HUB 


scoreboard players set @a [scores={alive=0}] alive 2
