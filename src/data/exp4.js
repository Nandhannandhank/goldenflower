const P = 'app/src/main/java/com/example/madlab/'

export default {
  id: 4,
  title: 'Contact Directory',
  question: `Contact Directory
• Display a scrollable employee list.
• Show employee name, designation and phone number.
• Use a reusable composable for each row.
• Show selected employee's name in a Snackbar when tapped.`,
  gradle: [
    {
      name: 'app/build.gradle.kts',
      code: `// No extra dependencies needed.
// The default "Empty Activity" (Compose) template is enough.`,
    },
  ],
  manifest: null,
  files: [
    {
      name: 'Employee.kt',
      path: P,
      code: `package com.example.madlab

data class Employee(val name: String, val designation: String, val phone: String)

val employees = listOf(
    Employee("Arun Kumar", "Manager", "98765 43210"),
    Employee("Divya S", "Developer", "98765 43211"),
    Employee("Karthik R", "Designer", "98765 43212"),
    Employee("Meena P", "Tester", "98765 43213"),
    Employee("Suresh V", "HR Executive", "98765 43214"),
    Employee("Priya N", "Accountant", "98765 43215"),
    Employee("Vignesh M", "Team Lead", "98765 43216"),
    Employee("Lakshmi T", "Analyst", "98765 43217"),
    Employee("Ravi K", "Support Engineer", "98765 43218"),
    Employee("Anitha B", "Receptionist", "98765 43219")
)
`,
    },
    {
      name: 'MainActivity.kt',
      path: P,
      code: `package com.example.madlab

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                ContactScreen()
            }
        }
    }
}

@Composable
fun ContactScreen() {
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    Scaffold(snackbarHost = { SnackbarHost(snackbarHostState) }) { padding ->
        LazyColumn(Modifier.padding(padding)) {
            items(employees) { emp ->
                EmployeeRow(emp) {
                    scope.launch { snackbarHostState.showSnackbar(emp.name) }
                }
            }
        }
    }
}

// Reusable composable: used once for every employee
@Composable
fun EmployeeRow(emp: Employee, onClick: () -> Unit) {
    Column(
        Modifier.fillMaxWidth().clickable { onClick() }.padding(16.dp)
    ) {
        Text(emp.name, style = MaterialTheme.typography.titleMedium)
        Text(emp.designation)
        Text(emp.phone)
    }
}
`,
    },
  ],
  explain: [
    'LazyColumn is the scrollable list. It only draws the rows that are visible on the screen.',
    'EmployeeRow is the reusable composable. It shows name, designation and phone for one employee.',
    'onClick is passed into EmployeeRow as a function, so the row itself does not need to know about the Snackbar.',
    'Scaffold gives a place (snackbarHost) where the Snackbar appears at the bottom.',
    'showSnackbar is a suspend function, so it must run inside scope.launch { }.',
  ],
}
