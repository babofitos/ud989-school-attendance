/* STUDENT APPLICATION */
$(function() {
    var model = {
        init: function() {
            if (!localStorage.attendance) {
                console.log('Creating attendance records...');
                function getRandom() {
                    return (Math.random() >= 0.5);
                }

                var nameColumns = this.names;
                    attendance = {};

                $.each(nameColumns, function(index, value) {
                    var name = value;
                    attendance[name] = [];
                    var numDays = model.getNumDays();
                    for (var i = 0; i < numDays; i++) {
                        attendance[name].push(getRandom());
                    }
                });
                this.setAttendance(attendance);
            }
        },
        names: [
            'Slappy the Frog', 
            'Lilly the Lizard', 
            'Paulrus the Walrus', 
            'Gregory the Goat', 
            'Adam the Anaconda'
        ],
        getAllAttendance: function() {
            return JSON.parse(localStorage.attendance);
        },
        setAttendance: function(data) {
            localStorage.attendance = JSON.stringify(data);
        },
        getNumDays: function() {
            return 12;
        }
    };

    var attendanceView = {
        init: function() {
            this.$thead = $('thead tr');
            this.$tbody = $('table tbody');
            this.render();
        },
        makeCheckboxes: function(tr, day) {
            var tdAttend = $('<td/>', {
                class: 'attend-col'
            });
            var checkBox = $('<input/>', {
                type: 'checkbox'
            });
            if (day) {
                checkBox.prop('checked', true);
            }
            tdAttend.append(checkBox);
            tr.append(tdAttend);
        },
        render: function() {
            this.attendance = octopus.getAttendance();
            this.$tbody.empty();
            this.$thead.empty();
            this.renderTds();
            this.renderThs();
        },
        renderThs: function() {
            var ths = [];
            var th = $('<th/>', {
                class: 'name-col',
                text: 'Student Name'
            });
            ths.push(th);
            var numDays = octopus.getNumDays() + 1;
            for (var i=1;i<numDays;i++) {
            th = $('<th/>', {
                text: i
            });
            ths.push(th);
            }
            th = $('<th/>', {
                class: 'missed-col',
                text: 'Days Missed-col'
            });
            ths.push(th);
            this.$thead.append(ths);
        },
        renderTds: function() {
            for (var prop in this.attendance) {
                if (this.attendance.hasOwnProperty(prop)) {
                    var days = this.attendance[prop];
                    var daysMissed = 12 - days.filter(function(day) {
                        return day === true;
                    }).length;
                    var tdName = $('<td/>', {
                        class: 'name-col',
                        text: prop
                    });
                    var tr = $('<tr/>', {
                        class: 'student'
                    });
                    var tdDaysMissed = $('<td/>', {
                        class: 'missed-col',
                        text: daysMissed
                    });
                    tr.append(tdName);
                    this.attendance[prop].forEach(this.makeCheckboxes.bind(undefined, tr));
                    tr.append(tdDaysMissed);
                    this.$tbody.append(tr);
                }
            }
        }
    };

    var octopus = {
        init: function() {
            model.init();
            attendanceView.init();
            attendanceView.$tbody.on('click', 'input', function() {
                octopus.updateAttendance();
            });
        },
        getAttendance: function() {
            return model.getAllAttendance();
        },
        updateAttendance: function() {
            var data = {};
            var attendance = this.getAttendance();
            $('.student').each(function(index) {
                var $children = $(this).children();
                var studentName = $children.eq(0).text();
                var inputs = $children.slice(1).children();
                data[studentName] = inputs.map(function(i, el) {
                   return $(el).prop('checked');
                }).get();
                
            });
            model.setAttendance(data);
            attendanceView.render();
        },
        getNumDays: function() {
            return model.getNumDays();
        }
    };
    octopus.init();
}());
