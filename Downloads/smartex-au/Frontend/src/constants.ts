
import { Department, Subject, SubjectCard } from './types';

export const DEPARTMENTS: Department[] = [
  { id: 'aids', name: 'AI & DS', icon: 'fa-brain' },
  { id: 'cse', name: 'Computer Science and Engineering', icon: 'fa-laptop-code' },
  { id: 'it', name: 'Information Technology', icon: 'fa-network-wired' }
];

export const SUBJECTS: Subject[] = [
  {
    id: 'os-cs3491',
    code: 'CS3491',
    name: 'Operating Systems',
    departmentId: 'aids',
    year: 2,
    semester: 4,
    notes: [
      { 
        id: 'n1', 
        name: 'Unit 1: Introduction to Operating Systems', 
        url: '', 
        type: 'text',
        content: `Unit 1: Introduction to Operating Systems

Operating System Fundamental
Definition: System software that manages computer hardware and software resources.
Provides: Common services to application programs.
Acts as: An intermediary between users and hardware.
Ensures: Correct, efficient, and secure execution of programs.
Prevents: Misuse and conflict of system resources.
Without an OS: Users must manually control hardware. System becomes impractical and error-prone.

Operating System: Objectives and Functions
1. Convenience:
- Makes the computer system easy to use.
- Hides hardware complexity from users.
- Provides simple interfaces for interaction.
2. Efficiency:
- Ensures optimal utilization of system resources (CPU, Memory, I/O devices).
- Uses efficient scheduling and allocation.
- Reduces idle time and improves performance.
3. Ability to Evolve:
- OS should be flexible and extensible.
- Supports new hardware and technologies.
- Allows feature upgrades without complete redesign.

Functions:
- Process Management:
- Creates and terminates processes.
- Schedules CPU among processes.
- Supports inter-process communication and synchronization.
- Memory Management:
- Allocates and deallocates memory.
- Manages virtual memory.
- Ensures memory protection between processes.
- File Management:
- Handles file creation, deletion, reading, and writing.
- Manages directories and access permissions.
- Organizes storage efficiently.
- Device Management:
- Controls I/O devices using device drivers.
- Uses buffering and spooling techniques.
- Allocates devices to processes.
- Security and Protection:
- Prevents unauthorized access.
- Protects system resources and data.
- Error Detection and Accounting:
- Detects hardware and software errors.
- Maintains records of resource usage.
- User Interface:
- Provides interaction through:
- Command Line Interface (CLI)
- Graphical User Interface (GUI)

Evolution of Operating Systems:
Operating systems evolved to overcome limitations of earlier computing models and to improve resource utilization, user interaction, and system performance.

1. Serial Processing Systems (No Operating System)
- Description: Early computers had no operating system. Programs were executed one at a time.
- Problems: Extremely slow execution, high error rate, CPU idle most of the time.

2. Batch Operating Systems
- Definition: Jobs with similar requirements were grouped into batches.
- Features: Use of resident monitor, automatic job sequencing, improved CPU utilization.
- Limitations: No interaction with users, long turnaround time, difficult debugging.

3. Multiprogramming Operating Systems
- Definition: Multiple jobs are kept in memory at the same time. CPU switches between jobs to remain busy.
- Advantages: Better CPU utilization, increased system throughput.

4. Time-Sharing Operating Systems
- Definition: Extension of multiprogramming. Allows multiple users to interact with system simultaneously.
- Advantages: Fast response time, interactive computing.

5. Real-Time Operating Systems (RTOS)
- Definition: OS where correctness depends on time constraints. Tasks must complete within deadlines.
- Types: Hard RTOS (Missing a deadline causes system failure), Soft RTOS (Deadline miss degrades performance).

6. Distributed Operating Systems
- Definition: Manages a collection of independent computers. Appears as a single system to users.
- Advantages: Resource sharing, improved reliability, scalability.

7. Network Operating Systems
- Definition: Provides services over a network. Each system has its own local OS.
- Features: File sharing, printer sharing, remote login.

8. Modern Operating Systems
- Characteristics: Support multitasking and multiprocessing, virtualization support, cloud and mobile compatibility, strong security mechanisms.
- Examples: Linux, Windows, Android, macOS.

Operating System Services:
1. User Interface: Provides CLI or GUI for user interaction.
2. Program Execution: Loads and executes programs.
3. I/O Operations: Manages input and output devices.
4. File System Manipulation: Creates, deletes, reads, and writes files.
5. Communication: Enables inter-process communication (IPC).
6. Error Detection: Detects hardware and software errors.
7. Resource Allocation: Allocates CPU, memory, I/O devices, and storage.
8. Accounting: Tracks resource usage by users and processes.
9. Protection and Security: Prevents unauthorized access.

OPERATING SYSTEM STRUCTURE:
Definition: Operating System Structure refers to the internal organization of an operating system.
Types:
1. Simple (Monolithic) Structure
- Description: OS is designed as one large program running in kernel mode.
- Advantages: High performance due to direct communication, minimal overhead.
- Disadvantages: Difficult to debug and maintain, a single error can crash the entire system.
- Example: MS-DOS.
2. Layered Structure
- Description: OS divided into several layers, each performing a specific function.
- Advantages: Clear modular design, easy debugging and testing.
- Disadvantages: Performance overhead due to multiple layers.
- Example: THE operating system.
3. Microkernel Structure
- Description: Only essential services are kept inside the kernel.
- Advantages: High reliability and security, fault isolation.
- Disadvantages: Performance overhead due to inter-process communication.
- Examples: Mach, MINIX.
4. Modular Structure
- Description: Uses a core kernel with additional functionalities as loadable modules.
- Example: Linux.
5. Hybrid Structure
- Description: Combines features of monolithic, microkernel, and modular architectures.
- Advantages: High performance, flexible and extensible design.
- Examples: Windows, macOS.`
      }
    ],
    pastPapers: [
      {
        id: 'os-pp-2021',
        name: 'Nov/Dec 2021 Question Paper',
        url: '#',
        year: '2021',
        type: 'pdf'
      },
      {
        id: 'os-pp-2022',
        name: 'Nov/Dec 2022 Question Paper',
        url: '#',
        year: '2022',
        type: 'pdf'
      },
      {
        id: 'os-pp-2023',
        name: 'Nov/Dec 2023 Question Paper',
        url: '#',
        year: '2023',
        type: 'pdf'
      }
    ],
    importantQuestions: []
  }
];

export const SYLLABUS_CONTEXT = `
You are "Smartex AU Academic Assistant". 
Respond in a structured, professional, and concise manner based on the Anna University syllabus.
Focus on Unit 1: Introduction to Operating Systems.
The user is viewing content based on the premium Smartex AU portal notes.
Use technical terms and explain concepts clearly as if to an engineering student.
`;

// Added SYLLABUS export to fix Dashboard.tsx import error
export const SYLLABUS = {
  units: [
    {
      number: 1,
      title: 'Introduction to Operating Systems',
      topics: [
        {
          id: 'os-fundamentals',
          unit: 1,
          title: 'OS Fundamentals',
          description: 'Basic concepts, objectives, and functions of modern operating systems.',
          icon: 'fa-microchip',
          summary: 'An Operating System (OS) is system software that manages computer hardware and software resources. It provides common services to application programs and acts as an intermediary between users and hardware. Key objectives include convenience, efficiency, and ability to evolve.',
          diagramTitle: 'OS Kernel Architecture',
          suggestedQuestions: [
            'What are the main objectives of an OS?',
            'Explain the functions of an Operating System.',
            'Differentiate between CLI and GUI.'
          ]
        },
        {
          id: 'os-evolution',
          unit: 1,
          title: 'Evolution of OS',
          description: 'From serial processing to modern distributed and cloud systems.',
          icon: 'fa-timeline',
          summary: 'Operating systems evolved to overcome limitations of earlier computing models. Key stages include Serial Processing, Batch Systems, Multiprogramming, Time-Sharing, Real-Time, Distributed, and Network Operating Systems.',
          diagramTitle: 'Timeline of OS Evolution',
          suggestedQuestions: [
            'What is a Batch Operating System?',
            'Explain Multiprogramming and Time-Sharing systems.',
            'What is a Real-Time Operating System?'
          ]
        },
        {
          id: 'os-structure',
          unit: 1,
          title: 'System Structures',
          description: 'Monolithic, Layered, Microkernel, and Modular architectures.',
          icon: 'fa-sitemap',
          summary: 'Operating System Structure refers to the internal organization of an operating system. Major structures include Monolithic (MS-DOS), Layered, Microkernel (MINIX), Modular (Linux), and Hybrid (Windows, macOS).',
          diagramTitle: 'Layered vs Microkernel Architecture',
          suggestedQuestions: [
            'Compare Monolithic and Microkernel structures.',
            'What are the advantages of Layered Structure?',
            'Explain Modular architecture in modern OS.'
          ]
        }
      ]
    }
  ]
};
