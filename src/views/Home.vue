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
import axios from 'axios'
import FullCalendar from '@fullcalendar/vue'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import interactionPlugin from '@fullcalendar/interaction'

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
        resources: []
      }
    }
  },
  components: {
    FullCalendar
  },
  methods: {
    fetchAppointments () {
      axios.get('http://127.0.0.1:8000/appointments')
        .then((response) => {
          response.data.slice(-5).forEach((value, index) => {
            console.log(value)
            var name = value.firstName + value.lastName
            this.calendarOptions.resources.push({ title: name })
          })
        })
        .catch((error) => {
          console.error(error)
        })
    }
  },
  mounted () {
    this.fetchAppointments()
  }
}
</script>
