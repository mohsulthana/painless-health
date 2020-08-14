<template>
  <div class="home">
    <div class="container">
      <FullCalendar :options="calendarOptions" />
    </div>
      <b-modal :active.sync="appointmentModal"
        has-modal-card
        trap-focus
        :destroy-on-hide="false"
        aria-role="dialog"
        aria-modal>
        Hello
    </b-modal>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import interactionPlugin from '@fullcalendar/interaction'

var Acuity = require('acuityscheduling')

export default {
  name: 'Home',
  data () {
    return {
      appointmentModal: false,
      calendarOptions: {
        plugins: [interactionPlugin, resourceTimeGridPlugin],
        initialView: 'resourceTimeGridDay',
        headerToolbar: {
          left: 'today prev,next',
          center: 'title'
        },
        dateClick: function (info) {
          this.appointmentModal = true
        },
        select: function (info) {
          alert('selected ' + info.startStr + ' to ' + info.endStr)
        },
        resources: [
          { id: 'a', title: 'Room A' },
          { id: 'b', title: 'Room B' },
          { id: 'c', title: 'Room C' },
          { id: 'd', title: 'Room D' }
        ]
      }
    }
  },
  components: {
    FullCalendar
  },
  methods: {
    fetchAppointments () {
      var userId = '20222948'
      var apiKey = '3e13d7077d8f622d5831ba67352be692'
      var acuity = Acuity.basic({
        userId: userId,
        apiKey: apiKey
      })

      acuity.request('/appointments', function (err, res, appointments) {
        if (err) return console.error(err)
        console.log(appointments)
      })
    }
  },
  mounted () {
    this.fetchAppointments()
  }
}
</script>
