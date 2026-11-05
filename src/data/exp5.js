const P = 'app/src/main/java/com/example/madlab/'

export default {
  id: 5,
  title: 'Background Sync using WorkManager',
  question: `Background Sync using WorkManager
• Start Sync button.
• Cancel Sync button.
• Periodic task every 15 minutes.
• Log current time.
• Display Enqueued, Running, Succeeded and Cancelled status.`,
  gradle: [
    {
      name: 'app/build.gradle.kts',
      code: `dependencies {
    // ADD this line
    implementation("androidx.work:work-runtime-ktx:2.9.1")
}`,
    },
  ],
  manifest: null,
  files: [
    {
      name: 'SyncWorker.kt',
      path: P,
      code: `package com.example.madlab

import android.content.Context
import android.util.Log
import androidx.work.Worker
import androidx.work.WorkerParameters
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class SyncWorker(context: Context, params: WorkerParameters) : Worker(context, params) {

    override fun doWork(): Result {
        val time = SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())
        Log.d("SyncWorker", "Sync done at " + time)
        return Result.success()
    }
}
`,
    },
    {
      name: 'MainActivity.kt',
      path: P,
      code: `package com.example.madlab

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import java.util.concurrent.TimeUnit

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                SyncScreen()
            }
        }
    }
}

@Composable
fun SyncScreen() {
    val context = LocalContext.current
    val workManager = WorkManager.getInstance(context)

    // Live list of work info; the screen updates whenever the status changes
    val infos by workManager.getWorkInfosForUniqueWorkFlow("sync")
        .collectAsState(initial = emptyList())

    // ENQUEUED, RUNNING, SUCCEEDED or CANCELLED
    val status = infos.firstOrNull()?.state?.name ?: "NOT STARTED"

    Column(Modifier.statusBarsPadding().padding(16.dp)) {
        Text("Status: " + status, style = MaterialTheme.typography.headlineSmall)

        Button(onClick = {
            val request = PeriodicWorkRequestBuilder<SyncWorker>(15, TimeUnit.MINUTES).build()
            workManager.enqueueUniquePeriodicWork("sync", ExistingPeriodicWorkPolicy.KEEP, request)
        }) {
            Text("Start Sync")
        }

        Button(onClick = { workManager.cancelUniqueWork("sync") }) {
            Text("Cancel Sync")
        }
    }
}
`,
    },
  ],
  explain: [
    'SyncWorker is the background task. doWork() runs in the background and Log.d writes the current time to Logcat (filter by tag "SyncWorker").',
    'PeriodicWorkRequestBuilder<SyncWorker>(15, TimeUnit.MINUTES) creates a task that repeats every 15 minutes. 15 minutes is the minimum Android allows.',
    'enqueueUniquePeriodicWork with the name "sync" makes sure only one sync task exists at a time.',
    'cancelUniqueWork("sync") stops the task. Its status then becomes CANCELLED.',
    'getWorkInfosForUniqueWorkFlow gives the live status. The Text shows ENQUEUED (waiting), RUNNING (working now) or CANCELLED.',
    'A periodic task goes back to ENQUEUED after each run, so SUCCEEDED is only shown for a moment (or for one-time work). This is normal behaviour.',
    'No manifest change or permission is needed.',
  ],
}
