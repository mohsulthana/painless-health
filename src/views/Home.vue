<template>
  <div class="grid grid-cols-10 gap-4">
    <div class="col-span-3 bg-gray-200 py-8 px-4">
      <FullCalendar class="fullCalendar" ref="fullCalendar" :options="calendarOption" />
    </div>
    <div class="col-span-7 py-8 px-4">
      <FullCalendar class="resourceView" ref="resourceView" :options="resourceView" />
    </div>
    <div
      v-if="appointmentModal"
      class="fixed overflow-x-hidden overflow-y-auto inset-0 flex justify-center items-center z-50">
        <div class="relative mx-auto w-full max-w-2xl">
            <div class="bg-white w-full rounded-none shadow-2xl p-6">
              <div class="text-2xl mb-5 text-left">Add new appointment</div>
                <div class="flex px-2">
                  <div class="w-full px-4 mb-6 md:mb-0 overflow-auto h-45">
                    <div class="relative mb-2">
                      <label class="block text-primary text-sm text-left font-bold mb-2" for="appointmentType">
                        Appointment Type with {{doctor}}
                      </label>
                      <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                        <option v-for="type in appointmentType" :key="type.id">{{ `${type.name} (${type.duration} minutes)` }}</option>
                      </select>
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                    <div class="relative mb-2">
                      <label class="block text-primary text-sm text-left font-bold mb-2" for="firstName">
                        First Name *
                      </label>
                      <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-input rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane">
                    </div>
                    <div class="relative mb-2">
                      <label class="block text-primary text-sm text-left font-bold mb-2" for="lastName">
                        Last Name *
                      </label>
                      <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-input rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane">
                    </div>
                    <div class="relative mb-2">
                      <label class="block text-primary text-sm text-left font-bold mb-2" for="phone">
                        Phone
                      </label>
                      <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-input rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane">
                    </div>
                    <div class="relative mb-2">
                      <p class="text-left">{{ timeChoosen }}</p>
                    </div>
                    <div class="relative mb-2">
                      <label class="block text-primary text-sm text-left font-bold mb-2" for="email">
                        Email
                      </label>
                      <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-input rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane">
                    </div>
                    <div class="relative mb-2">
                      <label class="block text-primary text-sm text-left font-bold mb-2" for="notes">
                        Notes
                      </label>
                      <!-- <input class="block w-full text-gray-700 border border-input rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane"> -->
                      <textarea class="resize-x border w-full rounded focus:outline-none focus:shadow-outline"></textarea>
                    </div>
                  </div>
                </div>
              <button class="rounded border bg-primary border-primary text-whitesmoke px-6 mt-1 py-2 w-3/12 m-auto mb-3" @click="submitAppointment()">Submit</button>
              <button class="rounded border bg-transparent border-primary text-primary px-6 mt-1 py-2 w-3/12 m-auto mb-3" @click="appointmentModal = false">Close</button>
            </div>
        </div>
    </div>
    <div
      v-if="appointmentModal"
      class="absolute z-40 inset-0 opacity-50 bg-blacktext">
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import FullCalendar from '@fullcalendar/vue'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import momentTZ from 'moment-timezone'
import moment from 'moment'

export default {
  name: 'Home',
  data () {
    return {
      appointmentType: [],
      formValues: {},
      doctor: '',
      time: '',
      timeZone: momentTZ.tz.names(),
      appointmentModal: true,
      resourceView: {
        selectable: true,
        plugins: [interactionPlugin, resourceTimeGridPlugin],
        initialView: 'resourceTimeGridDay',
        dateClick: (info) => {
          console.log(info)
          this.doctor = info.resource._resource.title
          // this.time = this.timeChoosen(info.dateStr)
          this.appointmentModal = !this.appointmentModal
        },
        resources: [],
        events: []
      },
      calendarOption: {
        navLinks: true,
        plugins: [dayGridPlugin],
        header: {
          left: 'title',
          center: '',
          right: 'prev,next'
        },
        events: 'https://fullcalendar.io/demo-events.json',
        initialView: 'dayGridMonth',
        navLinkDayClick: (date, jsEvent) => {
          const calendarApi = this.$refs.resourceView.getApi()
          calendarApi.gotoDate(date)
        },
        eventRender: function (info) {
          console.log(info)
        }
      }
    }
  },
  computed: {
    timeChoosen (time) {
      return moment(time).format('MMMM D YYYY, @ h:mm A')
    }
  },
  components: {
    FullCalendar
  },
  methods: {
    createAppointments () {
      axios.post('https://powerful-everglades-59936.herokuapp.com/appointments')
    },
    fetchAppointmentsType () {
      axios.get('https://powerful-everglades-59936.herokuapp.com/appointments-type')
        .then((response) => {
          console.log(response)
          this.appointmentType = [...new Set(response.data)]
        })
    },
    fetchAppointments () {
      axios.get('https://powerful-everglades-59936.herokuapp.com/appointments')
        .then((response) => {
          response.data.slice(-10).forEach((value, index) => {
            var name = `${value.firstName} ${value.lastName}`
            this.resourceView.resources.push({ title: name, id: value.id })
            this.resourceView.events.push({ resourceId: value.id, title: value.type, start: '2020-08-19T10:30:00+00:00', end: '2020-08-19T12:30:00+00:00' })
          })
        })
        .catch((error) => {
          console.error(error)
        })
    }
  },
  mounted () {
    this.fetchAppointments()
    this.fetchAppointmentsType()
  }
}
</script>

<style lang="scss">
.fullCalendar.fc {
  .fc-col-header-cell-cushion {
    display: inline-block;
    padding: 2px 2px;
  }
  .fc-daygrid-day-number {
    margin: auto;
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
    text-align: center;
  }
  td, th, table {
    border-style: none !important;
  }
  .vc-day {
    font-weight: 500;
  }
  .vc-day-content {
    background-color: #DD6B20;
  }
  table td a {
    font-size: 14px;
  }

  .fc-button .fc-icon {
    font-size: 1.2rem;
  }

  // .fc-h-event {

  // }

  .fc-button-primary {
    color: #718096;
    background-color: transparent;
    border-color: transparent;

    &:hover {
      background-color: #e2e8f0;
    }
  }
}

#calendar {
  max-width: 900px;
  margin: 0 auto;
}

//Styles added to show Horizontal Scroll Bar
.fc-view-container {
  width: auto;
}

.fc-view-container .fc-view {
  overflow-x: scroll;
}

.fc-view-container .fc-view > table {
  width: 2500px;
}

</style>
