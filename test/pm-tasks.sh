#
# valmerge test script to run project management tasks
# load sample data

mongo valmerge < pm-tasks.mon

# run valmerge
node pm-tasks
